// app/api/campaigns/[campaignId]/queue/control/route.ts
// Next.js dynamic route for POST /api/campaigns/[campaignId]/queue/control

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { queueManager } from '@/lib/queue/queueManager';

const controlSchema = z.object({
  action: z.enum(['pause', 'resume', 'getMetrics', 'clean']),
});

export async function POST(req: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const body = await req.json();
    const parsed = controlSchema.parse(body);
    const campaignId = params.campaignId;

    switch (parsed.action) {
      case 'pause':
        await queueManager.pauseCampaignQueue(campaignId);
        return NextResponse.json({ status: 'paused' });
      case 'resume':
        await queueManager.resumeCampaignQueue(campaignId);
        return NextResponse.json({ status: 'resumed' });
      case 'getMetrics':
        const status = await queueManager.getQueueStatus(campaignId);
        return NextResponse.json(status);
      case 'clean':
        const queue = queueManager.getQueue(campaignId);
        if (queue) {
          await queue.clean(0, 1000, 'completed'); // Clean completed jobs
          await queue.clean(0, 1000, 'failed'); // Clean failed jobs
        }
        return NextResponse.json({ status: 'cleaned' });
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}