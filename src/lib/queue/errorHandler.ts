// lib/queue/error-handler.ts
import { Job } from 'bullmq';
import { db } from '@/lib/db';
import { queueManager } from '@/lib/queue/queueManager';
import { campaigns } from '@/lib/db/schema'; // Assume error_strategy field added to campaigns
import { eq } from 'drizzle-orm';

class CampaignErrorHandler {
  static async handleJobError(job: Job, error: Error): Promise<void> {
    const campaignId = job.data.campaignId;

    // Fetch strategy from DB (assume added to schema)
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, parseInt(campaignId)));
    const strategy = campaign.errorStrategy || 'retry-with-backoff'; // Default

    switch (strategy) {
      case 'retry-with-backoff':
        await job.retry();
        break;
      case 'pause-on-failure':
        await queueManager.pauseCampaignQueue(campaignId);
        await notifyCampaignOwner(campaignId, 'queue-paused-due-to-errors'); // Implement notifier
        break;
      case 'skip-and-continue':
        await job.moveToFailed(new Error(error.message), "", true);
        break;
    }
  }
}

// Placeholder
async function notifyCampaignOwner(campaignId: string, message: string) {
  // Send email or notification
}

export { CampaignErrorHandler };