// app/api/runs/route.ts
// Next.js API route for POST /api/runs

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from "@/lib/db"
import { campaignRuns, campaignRunLeads, campaigns, workflowDefinitions, leads } from '@/lib/db/schema';
import { queueManager } from '@/lib/queue/queueManager';
import { eq, and } from 'drizzle-orm';

// Schema as per instructions
const createRunSchema = z.object({
  campaignId: z.number(),
  leadListId: z.number(),
  filters: z.object({}).optional(), // JSON filters
  priority: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createRunSchema.parse(body);

    // Verify campaign and queue
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, parsed.campaignId));
    if (!campaign) throw new Error('Campaign not found');

    const [workflowDef] = await db.select().from(workflowDefinitions).where(eq(workflowDefinitions.campaignId, parsed.campaignId));
    if (!workflowDef) throw new Error('Workflow definition not found');


    const queue = queueManager.getQueue(`${parsed.campaignId}`);
    if (!queue) throw new Error('No active queue for campaign');

    // Create run record
    const [newRun] = await db.insert(campaignRuns).values({
      campaignId: parsed.campaignId,
      // leadListId: parsed.leadListId,
      workflowDefinitionId: workflowDef.id,
      status: 'pending',
      // ... other fields
    }).returning();

    // Apply filters to leads (assume getFilteredLeads function based on WorkflowRunnerContext logic)
    const filteredLeads = await getFilteredLeads(parsed.leadListId, parsed.filters || {});
    const leadIds = filteredLeads.map(lead => lead.id);

    // Create campaign_run_leads with snapshots
    const runLeads = await Promise.all(
      leadIds.map(async leadId => ({
        campaignRunId: newRun.id, // <-- correct property name
        leadId,
        status: 'pending',
        snapshot: await getLeadSnapshot(leadId),
      }))
    );

    await db.insert(campaignRunLeads).values(runLeads);

    // Add job to queue
    await queue.add('process-campaign-run', {
      runId: newRun.id,
      campaignId: parsed.campaignId,
      leadIds,
    }, {
      priority: parsed.priority || 1,
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
    });

    return NextResponse.json({ run: newRun }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// Placeholder functions (implement based on schema and context)
async function getFilteredLeads(leadListId: number, filters: any): Promise<any[]> {
  // Query leads with filters
  return [];
}

async function getLeadSnapshot(leadId: number): Promise<any> {
  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
  if (!lead) return null;
  // You can customize the snapshot structure as needed
  return {
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    company: lead.company,
    position: lead.position,
    profileUrl: lead.profileUrl,
    connected: lead.connected,
    // Add other fields if needed
  };
}