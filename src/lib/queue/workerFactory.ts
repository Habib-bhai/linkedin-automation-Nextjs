// lib/queue/worker-factory.ts
import { Worker, Job } from 'bullmq';

import { db } from '@/lib/db';
import { queueManager } from '@/lib/queue/queueManager';
import { processCampaignJob } from '@/lib/execution/campaignProcessor'; // Forward declaration, implement later
import { redisClient } from '../redis/redisClient';
import { CampaignErrorHandler } from './errorHandler';

interface WorkflowDefinition {
  nodes: any[]; // From JSONB
  edges: any[]; // From JSONB
}

class CampaignWorkerFactory {
  static createWorkerForCampaign(
    campaignId: string,
    workflowDefinition: WorkflowDefinition,
    dbClient: typeof db // Pass db for type safety
  ): Worker {
    const queueName = `campaign:${campaignId}`;
    const worker = new Worker(queueName, async (job: Job) => {
      return processCampaignJob(job, workflowDefinition, dbClient);
    }, {
      concurrency: 5,
      connection: redisClient,
      limiter: {
        max: 10,
        duration: 1000,
      },
      autorun: true,
    });

    // Register with manager
    queueManager.registerWorker(campaignId, worker);

    // Attach error handler
    worker.on('failed', async (job, error) => {
      if (job) {
        await CampaignErrorHandler.handleJobError(job, error);
      }
    });

    return worker;
  }
}

export { CampaignWorkerFactory };