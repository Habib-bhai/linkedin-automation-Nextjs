"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Node, Edge } from "reactflow";

/**
 * WorkflowRunnerContext for managing canvas state and campaigns/runs via backend API.
 *
 * Note: Execution logic has been moved to the backend. This context now handles
 * canvas state (nodes/edges) in-memory and interacts with backend APIs for
 * campaigns and runs. LocalStorage persistence has been removed in favor of
 * server-side storage.
 */

// Types
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
  status: string; // e.g., "idle", "running", "completed", etc. (fetched from backend)
};

export type WorkflowRunnerContextValue = {
  // canvas
  workflowNodes: Node[];
  workflowEdges: Edge[];
  setWorkflowNodes: (nodes: Node[]) => void;
  setWorkflowEdges: (edges: Edge[]) => void;

  // campaigns & runs (fetched from backend)
  campaigns: Campaign[];
  runs: Run[];
  refreshCampaigns: () => Promise<void>;
  refreshRuns: () => Promise<void>;
  createCampaign: (opts: { name?: string; meta?: any; nodes: Node[]; edges: Edge[] }) => Promise<Campaign>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  deleteRun: (runId: string) => Promise<void>;
  getRunsForCampaign: (campaignId: string) => Run[];
  startRun: (opts: { campaignId: string; leadListId: number; filters?: any; priority?: number }) => Promise<Run>;
};

const WorkflowRunnerContext = createContext<WorkflowRunnerContextValue | null>(null);

export function WorkflowRunnerProvider({ children }: { children: React.ReactNode }) {
  // Canvas (in-memory state)
  const [workflowNodes, setWorkflowNodes] = useState<Node[]>([]);
  const [workflowEdges, setWorkflowEdges] = useState<Edge[]>([]);

  // Campaigns and runs (fetched from backend)
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);

  // ---------------- Fetch campaigns and runs on mount ----------------
  const refreshCampaigns = useCallback(async () => {
    try {
      const res = await fetch('/api/campaigns');
      if (!res.ok) throw new Error('Failed to fetch campaigns');
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch (err) {
      console.error("Failed to load campaigns", err);
    }
  }, []);

  const refreshRuns = useCallback(async () => {
    try {
      const res = await fetch('/api/runs');
      if (!res.ok) throw new Error('Failed to fetch runs');
      const data = await res.json();
      setRuns(data.runs || []);
    } catch (err) {
      console.error("Failed to load runs", err);
    }
  }, []);

  useEffect(() => {
    refreshCampaigns();
    refreshRuns();
  }, [refreshCampaigns, refreshRuns]);

  // ---------------- Campaign / Run utilities ----------------
  const createCampaign = useCallback(async (opts: { name?: string; meta?: any; nodes: Node[]; edges: Edge[] }) => {
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: opts.name,
          // Assume userId is handled server-side or add if needed
          nodes: opts.nodes,
          edges: opts.edges,
        }),
      });
      if (!res.ok) throw new Error('Failed to create campaign');
      const newCampaign = await res.json();
      setCampaigns((prev) => [newCampaign.campaign, ...prev]);
      return newCampaign.campaign;
    } catch (err) {
      console.error("Failed to create campaign", err);
      throw err;
    }
  }, []);

  const deleteCampaign = useCallback(async (campaignId: string) => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete campaign');
      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setRuns((prev) => prev.filter((r) => r.campaignId !== campaignId));
    } catch (err) {
      console.error("Failed to delete campaign", err);
    }
  }, []);

  const deleteRun = useCallback(async (runId: string) => {
    try {
      const res = await fetch(`/api/runs/${runId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete run');
      setRuns((prev) => prev.filter((r) => r.id !== runId));
    } catch (err) {
      console.error("Failed to delete run", err);
    }
  }, []);

  const getRunsForCampaign = useCallback((campaignId: string) => {
    return runs.filter((r) => r.campaignId === campaignId);
  }, [runs]);

  // ---------------- Trigger run via backend API ----------------
  const startRun = useCallback(async (opts: { campaignId: string; leadListId: number; filters?: any; priority?: number }) => {
    try {
      const res = await fetch('/api/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opts),
      });
      if (!res.ok) throw new Error('Failed to start run');
      const newRun = await res.json();
      setRuns((prev) => [newRun.run, ...prev]);
      return newRun.run;
    } catch (err) {
      console.error("Failed to start run", err);
      throw err;
    }
  }, []);

  // ---------------- Exposed API ----------------
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
      refreshCampaigns,
      refreshRuns,
      createCampaign,
      deleteCampaign,
      deleteRun,
      getRunsForCampaign,

      // trigger execution via backend
      startRun,
    }),
    [
      workflowNodes,
      workflowEdges,
      setWorkflowNodes,
      setWorkflowEdges,
      campaigns,
      runs,
      refreshCampaigns,
      refreshRuns,
      createCampaign,
      deleteCampaign,
      deleteRun,
      getRunsForCampaign,
      startRun,
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