// app/api/runs/[runId]/progress/route.ts
// GET /api/runs/[runId]/progress - SSE

import { NextRequest, NextResponse } from 'next/server';
import { queueManager } from '@/lib/queue/queueManager';
import { db } from '@/lib/db';
import { campaignRuns } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { QueueEvents } from "bullmq"
export async function GET(req: NextRequest, { params }: { params: { runId: string } }) {
  const runId = parseInt(params.runId);

  // Get run to find campaignId
  const [run] = await db.select().from(campaignRuns).where(eq(campaignRuns.id, runId));
  if (!run) return NextResponse.json({ error: 'Run not found' }, { status: 404 });

  const response = new NextResponse(null, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });

  const stream = response.body as any; // For writing SSE

  // Function to send event
  const sendEvent = (data: any) => {
    stream.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Initial DB state
  const initialProgress = await getRunProgressFromDb(runId); // Implement: count completed/failed leads
  sendEvent({ type: 'progress', data: initialProgress });

  // Listen to queue events
  const queueEvents = await queueManager.getQueueEvents(`${run.campaignId}`);
  if (queueEvents) {
    const listener = async (args: { jobId: string; prev?: string }) => {
      // Check if related to this run (inspect job data)
      const job = await queueManager.getQueue(`${run.campaignId}`)?.getJob(args.jobId);
      if (job && job.data.runId === runId) {
        const updatedProgress = await getRunProgressFromDb(runId);
        sendEvent({ type: 'progress', data: updatedProgress });
      }
    };

    queueEvents.on('completed', listener);
    queueEvents.on('failed', listener);
    queueEvents.on('progress', listener);

    // Cleanup on close
    req.signal.addEventListener('abort', () => {
      queueEvents.off('completed', listener);
      queueEvents.off('failed', listener);
      queueEvents.off('progress', listener);
    });
  }

  return response;
}

// Placeholder
async function getRunProgressFromDb(runId: number): Promise<any> {
  // Query counts from campaign_run_leads
  return { completed: 0, failed: 0, total: 0 };
}