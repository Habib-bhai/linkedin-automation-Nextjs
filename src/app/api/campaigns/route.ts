// app/api/campaigns/route.ts
// Next.js API route for POST /api/campaigns

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { campaigns, workflowDefinitions, campaignQueues } from '@/lib/db/schema';
import { queueManager } from '@/lib/queue/queueManager';
import { CampaignWorkerFactory } from '@/lib/queue/workerFactory';
import { and, eq } from 'drizzle-orm';

// Assume body schema: { name: string, userId: number, nodes: any[], edges: any[] }
const createCampaignSchema = z.object({
  name: z.string(),
  userId: z.number(),
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createCampaignSchema.parse(body);

    // Create campaign
    const [newCampaign] = await db.insert(campaigns).values({
      name: parsed.name,
      userId: parsed.userId,
      // ... other fields
    }).returning();

    // Store workflow snapshot
    await db.insert(workflowDefinitions).values({
      campaignId: newCampaign.id,
      version: 1,
      nodes: parsed.nodes as any[],
      edges: parsed.edges as any[],
      isActive: true,
    });

    // Auto-create queue
    const queueName = `campaign:${newCampaign.id}`;
    const queue = await queueManager.createCampaignQueue({
      campaignId: `${newCampaign.id}`,
      queueName,
      concurrency: 3,
    });

    // Get active workflow definition
    const [workflowDef] = await db.select().from(workflowDefinitions).where(and(eq(workflowDefinitions.campaignId, newCampaign.id), eq(workflowDefinitions.isActive, true))
    );

    // Initialize worker
    CampaignWorkerFactory.createWorkerForCampaign(
      `${newCampaign.id}`,
      {
        ...workflowDef,
        nodes: workflowDef.nodes as any[],
        edges: workflowDef.edges as any[],
      },
      db
    );

    return NextResponse.json({ campaign: newCampaign }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}