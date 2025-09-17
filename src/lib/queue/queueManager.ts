// lib/queue/queue-manager.ts
import { Queue, Worker, JobsOptions, QueueEvents } from 'bullmq';
import { redisClient } from '@/lib/redis/redisClient'; // Assume Redis client with connection pooling
import { db } from '../db';  // Drizzle DbClient
import { campaignQueues } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface CampaignQueueConfig {
  campaignId: string;
  queueName: string;
  concurrency?: number;
  defaultJobOptions?: JobsOptions;
}

interface QueueStatus {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  paused: boolean;
}

class CampaignQueueManager {
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();
  private queueEvents: Map<string, QueueEvents> = new Map();

  async createCampaignQueue(config: CampaignQueueConfig): Promise<Queue> {
    const { campaignId, queueName, concurrency = 3, defaultJobOptions } = config;

    if (this.queues.has(campaignId)) {
      throw new Error(`Queue for campaign ${campaignId} already exists`);
    }

    const queue = new Queue(queueName, {
      connection: redisClient,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        ...defaultJobOptions,
      },
    });

    this.queues.set(campaignId, queue);

    // Create QueueEvents listener
    const queueEvents = new QueueEvents(queueName, { connection: redisClient });
    this.queueEvents.set(campaignId, queueEvents);

    // Store in DB
    await db.insert(campaignQueues).values({
      campaignId: parseInt(campaignId),
      queueName,
      workerCount: concurrency,
      status: 'active',
    });

    return queue;
  }

   async getQueueEvents(campaignId: string): Promise<QueueEvents | undefined> {
      return this.queueEvents.get(campaignId);
    }
  
  async removeCampaignQueue(campaignId: string): Promise<void> {
    const queue = this.queues.get(campaignId);
    if (!queue) return;

    await queue.drain(true); // Drain and delete jobs
    await queue.close();
    this.queues.delete(campaignId);

    const queueEvents = this.queueEvents.get(campaignId);
    if (queueEvents) {
      await queueEvents.close();
      this.queueEvents.delete(campaignId);
    }

   

    const worker = this.workers.get(campaignId);
    if (worker) {
      await worker.close();
      this.workers.delete(campaignId);
    }

    await db.delete(campaignQueues).where(eq(campaignQueues.campaignId, parseInt(campaignId)));
  }

  async pauseCampaignQueue(campaignId: string): Promise<void> {
    const queue = this.queues.get(campaignId);
    if (!queue) throw new Error(`Queue not found for campaign ${campaignId}`);

    await queue.pause();
    await db.update(campaignQueues).set({ status: 'paused' }).where(eq(campaignQueues.campaignId, parseInt(campaignId)));
  }

  async resumeCampaignQueue(campaignId: string): Promise<void> {
    const queue = this.queues.get(campaignId);
    if (!queue) throw new Error(`Queue not found for campaign ${campaignId}`);

    await queue.resume();
    await db.update(campaignQueues).set({ status: 'active' }).where(eq(campaignQueues.campaignId, parseInt(campaignId)));
  }

  async getQueueStatus(campaignId: string): Promise<QueueStatus> {
    const queue = this.queues.get(campaignId);
    if (!queue) throw new Error(`Queue not found for campaign ${campaignId}`);

    const [waiting, active, completed, failed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      paused: await queue.isPaused(),
    };
  }

  // Additional method to get queue instance
  getQueue(campaignId: string): Queue | undefined {
    return this.queues.get(campaignId);
  }

  // Method to register worker
  registerWorker(campaignId: string, worker: Worker): void {
    this.workers.set(campaignId, worker);
  }
}

// Singleton instance
export const queueManager = new CampaignQueueManager();