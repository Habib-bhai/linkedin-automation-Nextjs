"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Node, Edge } from "reactflow";
import { executors, type ExecutorFn } from "@/lib/executors";

/**
 * WorkflowRunnerContext with localStorage persistence for campaigns & runs/logs.
 *
 * LocalStorage keys:
 * - wr_campaigns
 * - wr_runs
 *
 * Note: this keeps in-memory canvas state (workflowNodes/workflowEdges) as well.
 */

// Types
type WorkflowData = { [key: string]: any };

type LogItem = {
  ts: number;
  level?: "info" | "error";
  nodeId?: string;
  message: string;
};

type ExecStatus = "idle" | "running" | "completed" | "failed" | "canceled";

type Campaign = {
  id: string;
  name?: string;
  meta?: any;
  createdAt: number;
};

type Run = {
  id: string;
  campaignId?: string | null;
  startedAt: number;
  endedAt?: number;
  status: ExecStatus;
  logs: LogItem[];
  statusMap: Record<string, ExecStatus>;
};

export type WorkflowRunnerContextValue = {
  // canvas
  workflowNodes: Node[];
  workflowEdges: Edge[];
  setWorkflowNodes: (nodes: Node[]) => void;
  setWorkflowEdges: (edges: Edge[]) => void;

  // campaigns & runs
  campaigns: Campaign[];
  runs: Run[];
  createCampaign: (opts: { name?: string; meta?: any }) => Campaign;
  deleteCampaign: (campaignId: string) => void;
  deleteRun: (runId: string) => void;
  clearRunLogs: (runId: string) => void;
  getRunsForCampaign: (campaignId: string) => Run[];

  // execution
  runWorkflow: (opts?: { startNodeId?: string; campaignId?: string | null }) => Promise<void>;
  stopWorkflow: () => void;
  clearAllLogs: () => void;

  // monitoring
  logs: LogItem[];
  statusMap: Record<string, ExecStatus>;
  runnerStatus: ExecStatus;
  isExecuting: boolean;
};

const WorkflowRunnerContext = createContext<WorkflowRunnerContextValue | null>(null);

// Helpers
function normalizeActionType(raw?: string): string {
  if (!raw) return "";
  const withDashes = raw.replace(/([a-z0-9])([A-Z])/g, "$1-$2");
  return withDashes.replace(/[_\s]+/g, "-").toLowerCase();
}

const LS_CAMPAIGNS = "wr_campaigns";
const LS_RUNS = "wr_runs";

const wait = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export function WorkflowRunnerProvider({ children }: { children: React.ReactNode }) {
  // Canvas
  const [workflowNodes, setWorkflowNodes] = useState<Node[]>([]);
  const [workflowEdges, setWorkflowEdges] = useState<Edge[]>([]);

  // persisted entities
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);

  // logs & status
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, ExecStatus>>({});
  const [runnerStatus, setRunnerStatus] = useState<ExecStatus>("idle");
  const abortRef = useRef<{ aborted: boolean; currentRunId?: string | null }>({ aborted: false, currentRunId: null });

  const isExecuting = runnerStatus === "running";

  // ---------------- localStorage load on mount ----------------
  useEffect(() => {
    try {
      const rawCampaigns = typeof window !== "undefined" ? localStorage.getItem(LS_CAMPAIGNS) : null;
      const rawRuns = typeof window !== "undefined" ? localStorage.getItem(LS_RUNS) : null;
      if (rawCampaigns) {
        setCampaigns(JSON.parse(rawCampaigns));
      }
      if (rawRuns) {
        setRuns(JSON.parse(rawRuns));
      }
    } catch (err) {
      console.warn("Failed to load campaigns/runs from localStorage", err);
    }
  }, []);

  // ---------------- persist to localStorage when changed ----------------
  useEffect(() => {
    try {
      localStorage.setItem(LS_CAMPAIGNS, JSON.stringify(campaigns));
    } catch (err) {
      console.warn("Failed to save campaigns to localStorage", err);
    }
  }, [campaigns]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_RUNS, JSON.stringify(runs));
    } catch (err) {
      console.warn("Failed to save runs to localStorage", err);
    }
  }, [runs]);

  // ---------------- campaign / run utilities ----------------
  const createCampaign = useCallback((opts: { name?: string; meta?: any }) => {

    const id = `campaign-${Date.now()}`;

    const c: Campaign = { id, name: opts?.name, meta: opts?.meta, createdAt: Date.now() };
    setCampaigns((s) => [c, ...s]);
    return c;
  }, []);

  const deleteCampaign = useCallback((campaignId: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    // also delete runs associated
    setRuns((prev) => prev.filter((r) => r.campaignId !== campaignId));
  }, []);

  const createRun = useCallback((campaignId?: string | null) => {
    const id = `run-${Date.now()}`;
    const r: Run = { id, campaignId: campaignId ?? null, startedAt: Date.now(), status: "idle", logs: [], statusMap: {} };
    setRuns((s) => [r, ...s]);
    return r;
  }, []);

  const deleteRun = useCallback((runId: string) => {
    setRuns((prev) => prev.filter((r) => r.id !== runId));
  }, []);

  const clearRunLogs = useCallback((runId: string) => {
    setRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, logs: [] } : r)));
  }, []);

  const getRunsForCampaign = useCallback((campaignId: string) => {
    return runs.filter((r) => r.campaignId === campaignId);
  }, [runs]);

  const clearAllLogs = useCallback(() => {
    setLogs([]);
    setRuns((prev) => prev.map((r) => ({ ...r, logs: [] })));
  }, []);

  // ---------------- logging helper ----------------
  const addLog = useCallback((entry: Omit<LogItem, "ts">) => {
    const item: LogItem = { ts: Date.now(), ...entry };
    setLogs((s) => [...s, item]);

    const runId = abortRef.current.currentRunId;
    if (runId) {
      setRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, logs: [...r.logs, item] } : r)));
    }
  }, []);

  const stopWorkflow = useCallback(() => {
    abortRef.current.aborted = true;
    setRunnerStatus("canceled");
    addLog({ level: "info", message: "Workflow canceled by user" });

    const runId = abortRef.current.currentRunId;
    if (runId) {
      setRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, status: "canceled", endedAt: Date.now() } : r)));
    }
  }, [addLog]);

  // ---------------- state accessor for executors ----------------
  const getState = useCallback(() => ({ nodes: workflowNodes, edges: workflowEdges }), [workflowNodes, workflowEdges]);

  // ---------------- executeNode (delegates to executors map) ----------------
  const executeNode = useCallback(
    async (node: Node, inputData: WorkflowData) => {
      const raw = (node.data?.actionType as string) || (node.type as string);

      const actionType = normalizeActionType(raw);

      addLog({ nodeId: node.id, message: `Dispatching executor for action="${actionType}"` });

      const executor: ExecutorFn | undefined = (executors as Record<string, ExecutorFn>)[actionType];

      if (executor) {
        const res = await executor(node, {
          log: (msg: string) => addLog({ nodeId: node.id, message: msg }),
          getState,
        });
        return res ?? {};
      }

      addLog({ nodeId: node.id, message: `No executor for "${actionType}", using fallback.` });
      await wait(200);
      return { nextHandle: "source" };
    },
    [addLog, getState]
  );

  // ---------------- execute Node Sequence (DFS-like, sequential) ----------------
  const executeNodeSequence = useCallback(
    async (nodeId: string, inputData: WorkflowData = {}, visited = new Set<string>()) => {
      if (abortRef.current.aborted) {
        addLog({ level: "info", message: "Execution aborted", nodeId });
        return;
      }

      if (visited.has(nodeId)) {
        addLog({ nodeId, level: "error", message: `Cycle / visited: ${nodeId}. Skipping.` });
        return;
      }

      visited.add(nodeId);

      const currentNode = workflowNodes.find((n) => n.id === nodeId);
      if (!currentNode) {
        addLog({ nodeId, level: "error", message: `Node ${nodeId} not found` });
        return;
      }

      // mark running in maps & current run
      setStatusMap((prev) => ({ ...prev, [nodeId]: "running" }));
      const runId = abortRef.current.currentRunId;
      if (runId) {
        setRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, statusMap: { ...r.statusMap, [nodeId]: "running" } } : r)));
      }

      addLog({ nodeId, message: `Executing node ${nodeId}` });

      try {
        const execResult = await executeNode(currentNode, inputData);

        setStatusMap((prev) => ({ ...prev, [nodeId]: "completed" }));
        if (runId) {
          setRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, statusMap: { ...r.statusMap, [nodeId]: "completed" } } : r)));
        }
        addLog({ nodeId, message: `Node ${nodeId} completed` });

        const outgoing = workflowEdges.filter((e) => e.source === nodeId);
        if (outgoing.length === 0) {
          addLog({ nodeId, message: `No outgoing edges from ${nodeId}. End of branch.` });
          return;
        }

        let chosenEdges: Edge[] = [];
        const nextHandle = execResult.nextHandle;
        const pathTaken = (execResult as any).pathTaken;

        if (nextHandle) {
          chosenEdges = outgoing.filter((e) => ((e.sourceHandle ?? "source") === nextHandle));
        }

        if (chosenEdges.length === 0 && pathTaken) {
          const normalized = String(pathTaken).toLowerCase();
          chosenEdges = outgoing.filter((e) => {
            const label = String(e.label ?? "").toLowerCase();
            return label.includes(normalized) || label.includes(normalized.replace(/not/g, ""));
          });
        }

        if (chosenEdges.length === 0) {
          const noHandle = outgoing.filter((e) => !e.sourceHandle);
          chosenEdges = noHandle.length ? noHandle : outgoing;
        }

        for (const edge of chosenEdges) {
          if (abortRef.current.aborted) {
            addLog({ level: "info", message: "Execution aborted during traversal", nodeId });
            return;
          }
          addLog({ nodeId: edge.source, message: `Following edge ${edge.id ?? `${edge.source}->${edge.target}`}` });
          await executeNodeSequence(edge.target, execResult.meta ? { ...inputData, meta: execResult.meta } : inputData, visited);
        }
      } catch (err: any) {
        setStatusMap((prev) => ({ ...prev, [nodeId]: "failed" }));
        const runIdLocal = abortRef.current.currentRunId;
        if (runIdLocal) {
          setRuns((prev) => prev.map((r) => (r.id === runIdLocal ? { ...r, statusMap: { ...r.statusMap, [nodeId]: "failed" } } : r)));
        }
        addLog({ nodeId, level: "error", message: `Node ${nodeId} failed: ${err?.message ?? String(err)}` });
        setRunnerStatus("failed");
        throw err;
      }
    },
    [workflowNodes, workflowEdges, executeNode, addLog]
  );

  

  // ---------------- runWorkflow (attach to campaign optional) ----------------
  const runWorkflow = useCallback(
    async (opts?: { startNodeId?: string; campaignId?: string | null }) => {
      const startId =
        opts?.startNodeId ??
        workflowNodes.find((n) => normalizeActionType((n.data?.actionType as string) || (n.type as string)) === "start")?.id;

      if (!startId) {
        addLog({ level: "error", message: "No start node found" });
        return;
      }

      // create run and attach to campaign if provided
      const run = createRun(opts?.campaignId ?? null);
      abortRef.current.currentRunId = run.id;
      setRunnerStatus("running");
      setStatusMap({});
      setRuns((prev) => prev.map((r) => (r.id === run.id ? { ...r, status: "running" } : r)));
      abortRef.current.aborted = false;

      addLog({ level: "info", message: `Workflow run started (run=${run.id}, start=${startId}, campaign=${opts?.campaignId ?? "none"})` });

      try {
        await executeNodeSequence(startId, {}, new Set<string>());
        if (!abortRef.current.aborted) {
          setRunnerStatus("completed");
          setRuns((prev) => prev.map((r) => (r.id === run.id ? { ...r, status: "completed", endedAt: Date.now() } : r)));
          addLog({ level: "info", message: `Workflow run completed (run=${run.id})` });
        } else {
          setRunnerStatus("canceled");
          setRuns((prev) => prev.map((r) => (r.id === run.id ? { ...r, status: "canceled", endedAt: Date.now() } : r)));
        }
      } catch (err: any) {
        if (!abortRef.current.aborted) {
          setRunnerStatus("failed");
          setRuns((prev) => prev.map((r) => (r.id === run.id ? { ...r, status: "failed", endedAt: Date.now() } : r)));
          addLog({ level: "error", message: `Workflow run failed (run=${run.id}): ${err?.message ?? String(err)}` });
        }
      } finally {
        abortRef.current.currentRunId = null;
      }
    },
    [workflowNodes, createRun, executeNodeSequence, addLog]
  );

  // ---------------- exposed API ----------------
  const value = useMemo(
    () => ({
      // canvas
      workflowNodes,
      workflowEdges,
      setWorkflowNodes,
      setWorkflowEdges,

      // campaigns & runs
      campaigns,
      runs,
      createCampaign,
      deleteCampaign,
      deleteRun,
      clearRunLogs,
      getRunsForCampaign,

      // execution
      runWorkflow,
      stopWorkflow,
      clearAllLogs,

      // monitoring
      logs,
      statusMap,
      runnerStatus,
      isExecuting,
    }),
    [
      workflowNodes,
      workflowEdges,
      setWorkflowNodes,
      setWorkflowEdges,
      campaigns,
      runs,
      createCampaign,
      deleteCampaign,
      deleteRun,
      clearRunLogs,
      getRunsForCampaign,
      runWorkflow,
      stopWorkflow,
      clearAllLogs,
      logs,
      statusMap,
      runnerStatus,
      isExecuting,
    ]
  );

  return <WorkflowRunnerContext.Provider value={value}>{children}</WorkflowRunnerContext.Provider>;
}

export function useWorkflowRunner() {
  const ctx = useContext(WorkflowRunnerContext);
  if (!ctx) {
    throw new Error("useWorkflowRunner must be used within WorkflowRunnerProvider");
  }
  return ctx;
}
