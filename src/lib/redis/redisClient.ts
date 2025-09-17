// redisClient.ts

import { Redis } from 'ioredis';

type RedisClient = Redis;  // you can further type with interfaces if needed

// Create the client
const redisClient: RedisClient = new Redis(
  'redis://localhost:6379',
  {
    // socket/tcp / low-level options
    connectTimeout: 10000,     // Time to wait for initial connection (ms)
    // Note: keepAlive expects number (ms) delay
    keepAlive: 1,              // sets TCP keep-alive (delay). 1 ms means enabled almost immediately

    // auto reconnect / retry strategy
    retryStrategy(times: number): number | void {
      if (times > 10) {
        // stop trying to reconnect after 10 retries
        return undefined;  // returning undefined (or `void`) stops reconnect
      }
      // exponential backoff: e.g. 100ms * times, capped at 3000ms
      const delay = Math.min(times * 100, 3000);
      return delay;
    },

    // offline-queue: queue commands while disconnected so that they are executed once connected
    enableOfflineQueue: true,

    // max number of retries per request (when commands get queued); null = wait indefinitely
    maxRetriesPerRequest: null,

    // optional: show more readable error stacks
    showFriendlyErrorStack: true,
  }
);

// Event handlers
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

redisClient.on('ready', () => {
  console.log('Redis Client Ready');
});

redisClient.on('close', () => {
  console.warn('Redis Client Connection Closed');
});

redisClient.on('end', () => {
  console.warn('Redis Client Disconnected (end)');
});

// If you want to manual connect (lazy connect), you can do:
async function initializeRedis(): Promise<void> {
  try {
    // If you had set lazyConnect: true, you'd need connect().
    await redisClient.connect();
    console.log('Redis client successfully connected');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
    throw err;
  }
}

export { redisClient, initializeRedis };
