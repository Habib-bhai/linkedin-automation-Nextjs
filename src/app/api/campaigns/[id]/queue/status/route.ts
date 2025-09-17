// app/api/campaigns/[campaignId]/queue/status/route.ts
// GET /api/campaigns/[campaignId]/queue/status

import { NextRequest, NextResponse } from 'next/server';
import { queueManager } from '@/lib/queue/queueManager';

export async function GET(req: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const status = await queueManager.getQueueStatus(params.campaignId);
    // Add worker metrics if needed
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}