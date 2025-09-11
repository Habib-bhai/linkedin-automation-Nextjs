// lib/executors.ts
// Executors are small async functions that perform the node's work.
// Replace the simulated delays with real API calls / SDK calls.

export type ExecResult = {
  nextHandle?: string | undefined; // e.g. "yes" | "no" | "source"
  meta?: any;
}

export type ExecutorFn = (node: any, ctx: { log: (msg: string) => void, getState: () => any }) => Promise<ExecResult>;

// Simulated helper
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const executors: Record<string, ExecutorFn> = {
  start: async (node, { log }) => {
    log(`Start node "${node.id}" started`);
    await wait(300);
    log(`Start node "${node.id}" done`);
    return { nextHandle: "source" };
  },

  "send-connection": async (node, { log }) => {
    log(`Sending connection for node "${node.id}"...`);
    await wait(800);
    log(`Connection sent for "${node.id}"`);
    return { nextHandle: "source" };
  },

  "send-message": async (node, { log }) => {
    log(`Sending message for "${node.id}"...`);
    await wait(700);
    log(`Message sent for "${node.id}"`);
    return { nextHandle: "source" };
  },

  inmail: async (node, { log }) => {
    log(`Sending InMail "${node.id}"...`);
    await wait(900);
    log(`InMail sent "${node.id}"`);
    return { nextHandle: "source" };
  },

  "view-profile": async (node, { log }) => {
    log(`Viewing profile for "${node.id}"...`);
    await wait(400);
    log(`Profile viewed "${node.id}"`);
    return { nextHandle: "source" };
  },

  follow: async (node, { log }) => {
    log(`Following for "${node.id}"...`);
    await wait(350);
    log(`Followed "${node.id}"`);
    return { nextHandle: "source" };
  },

  "like-post": async (node, { log }) => {
    log(`Liking post for "${node.id}"...`);
    await wait(300);
    log(`Post liked "${node.id}"`);
    return { nextHandle: "source" };
  },

  // Conditional node - returns yes or no randomly for demo
  "if-connection": async (node, { log }) => {
    log(`Evaluating connection for "${node.id}"...`);
    await wait(350);
    const val = Math.random() > 0.5 ? "yes" : "no";
    log(`IfConnection "${node.id}" evaluated to: ${val}`);
    return { nextHandle: val };
  },

  "if-open-profile": async (node, { log }) => {
    log(`Checking if profile open "${node.id}"...`);
    await wait(350);
    const val = Math.random() > 0.5 ? "yes" : "no";
    log(`IfOpenProfile "${node.id}" evaluated to: ${val}`);
    return { nextHandle: val };
  },

  // default fallback
  default: async (node, { log }) => {
    log(`Executing unknown action for "${node.id}" (actionType=${node.data?.actionType})`);
    await wait(200);
    return { nextHandle: "source" };
  },
};
