// lib/execution/lead-processor.ts
import { db } from '@/lib/db';
import { nodeExecutions, campaignRunLeads } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { executors } from '@/lib/executors';

interface WorkflowDefinition {
  nodes: any[]; // Array of { id: string, type: string, data: any, ... }
  edges: any[]; // Array of { id: string, source: string, target: string, sourceHandle: string, targetHandle?: string, ... }
}

interface NodeExecutionResult {
  nodeId: string;
  status: 'completed' | 'failed';
  input: any;
  output: any;
  error?: string;
  startedAt: Date;
  completedAt: Date;
}

interface ExecutionResult {
  status: 'completed' | 'failed';
  nodeExecutions: NodeExecutionResult[];
}

class LeadWorkflowProcessor {
  async processLeadWorkflow(params: {
    runId: number;
    leadId: number;
    workflowDefinition: WorkflowDefinition;
    db: typeof db;
  }): Promise<void> {
    const { runId, leadId, workflowDefinition, db: dbClient } = params;

    // Load lead snapshot from DB (as stored during run creation)
    const [runLead] = await dbClient.select().from(campaignRunLeads).where(
      and(eq(campaignRunLeads.campaignRunId, runId), eq(campaignRunLeads.leadId, leadId))
    );
    if (!runLead) throw new Error('Run lead not found');

    const leadSnapshot = runLead.snapshot;

    // Execute workflow sequence
    const executionResult = await this.executeWorkflowSequence(
      workflowDefinition.nodes,
      workflowDefinition.edges,
      leadSnapshot
    );

    // Batch insert node executions
    const nodeExecData = executionResult.nodeExecutions.map(exec => ({
      campaignRunId: runId,
      leadId,
      nodeId: exec.nodeId,
      nodeType: this.getNodeType(exec.nodeId, workflowDefinition.nodes),
      status: exec.status,
      input: exec.input,
      output: exec.output,
      error: exec.error,
      startedAt: exec.startedAt,
      completedAt: exec.completedAt,
    }));
    await dbClient.insert(nodeExecutions).values(nodeExecData);

    // Update lead status
    await dbClient.update(campaignRunLeads).set({
      status: executionResult.status,
      updatedAt: new Date(),
    }).where(and(eq(campaignRunLeads.campaignRunId, runId), eq(campaignRunLeads.leadId, leadId)));
  }

  private async executeWorkflowSequence(nodes: any[], edges: any[], leadSnapshot: any): Promise<ExecutionResult> {
    const nodeExecutions: NodeExecutionResult[] = [];
    const state = { lead: leadSnapshot, meta: {} };
    let currentId = this.findStartNode(nodes)?.id;
    let overallStatus: 'completed' | 'failed' = 'completed';

    while (currentId) {
      const node = nodes.find(n => n.id === currentId);
      if (!node) {
        overallStatus = 'failed';
        break;
      }

      const input = { ...state }; // Clone current state as input
      const logs: string[] = [];
      const startedAt = new Date();

      try {
        const ctx = {
          log: (msg: string) => logs.push(msg),
          getState: () => state,
        };

        const execFn = executors[node.type] || executors.default;
        const result = await execFn(node, ctx);

        // Update state with meta if provided
        if (result.meta) {
          state.meta = { ...state.meta, ...result.meta };
        }

        const output = { ...result, logs }; // Include logs in output

        const completedAt = new Date();
        nodeExecutions.push({
          nodeId: currentId,
          status: 'completed',
          input,
          output,
          startedAt,
          completedAt,
        });

        // Determine next node
        if (result.nextHandle) {
          const edge = edges.find(e => e.source === currentId && e.sourceHandle === result.nextHandle);
          if (edge) {
            currentId = edge.target;
          } else {
            currentId = undefined;
          }
        } else {
          currentId = undefined;
        }
      } catch (err) {
        const completedAt = new Date();
        nodeExecutions.push({
          nodeId: currentId,
          status: 'failed',
          input,
          output: null,
          error: (err as Error).message,
          startedAt,
          completedAt,
        });
        overallStatus = 'failed';
        currentId = undefined;
      }
    }

    return {
      status: overallStatus,
      nodeExecutions,
    };
  }

  private findStartNode(nodes: any[]): any | undefined {
    return nodes.find(n => n.type === 'start');
  }

  private getNodeType(nodeId: string, nodes: any[]): string {
    const node = nodes.find(n => n.id === nodeId);
    return node?.type || 'unknown';
  }
}

export { LeadWorkflowProcessor };