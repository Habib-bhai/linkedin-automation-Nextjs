// app/api/campaigns/[campaignId]/queue/jobs/route.ts
// GET /api/campaigns/[campaignId]/queue/jobs?status=...

import { NextRequest, NextResponse } from 'next/server';
import { queueManager } from '@/lib/queue/queueManager';

export async function GET(req: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status') || 'waiting';

    const queue = queueManager.getQueue(params.campaignId);
    if (!queue) throw new Error('Queue not found');

    let jobs;
    switch (status) {
      case 'waiting':
        jobs = await queue.getWaiting(0, 100);
        break;
      case 'active':
        jobs = await queue.getActive(0, 100);
        break;
      case 'completed':
        jobs = await queue.getCompleted(0, 100);
        break;
      case 'failed':
        jobs = await queue.getFailed(0, 100);
        break;
      default:
        throw new Error('Invalid status');
    }

    const jobDetails = jobs.map(job => ({
      id: job.id,
      data: job.data,
      progress: job.progress,
      attempts: job.attemptsMade,
      failedReason: job.failedReason,
      timestamps: { created: job.timestamp, started: job.processedOn, finished: job.finishedOn },
    }));

    return NextResponse.json({ jobs: jobDetails });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}