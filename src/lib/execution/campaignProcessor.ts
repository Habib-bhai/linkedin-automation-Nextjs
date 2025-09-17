// lib/execution/campaign-processor.ts
// Implements processCampaignJob for workers

import { Job } from 'bullmq';
import { db } from "@/lib/db"
import { LeadWorkflowProcessor } from '@/lib/execution/leadProcessor';

interface CampaignJobData {
  runId: number;
  campaignId: number;
  leadIds: number[];
}

export async function processCampaignJob(
  job: Job<CampaignJobData>,
  workflowDefinition: any,
  dbClient: typeof db
): Promise<{ processed: number; status: string }> {
  const { runId, leadIds } = job.data;

  const processor = new LeadWorkflowProcessor();

  for (const leadId of leadIds) {
    if (await job.isFailed()) {
      throw new Error('Job failed - stopping execution');
    }

    await processor.processLeadWorkflow({
      runId,
      leadId,
      workflowDefinition,
      db: dbClient,
    });
  }

  return { processed: leadIds.length, status: 'completed' };
}