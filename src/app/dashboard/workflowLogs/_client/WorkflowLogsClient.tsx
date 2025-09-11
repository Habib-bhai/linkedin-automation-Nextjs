"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useWorkflowRunner } from "@/lib/workflowRunnerContext";
import { Button } from "@/components/ui/button";

export default function WorkflowLogsClient() {
  const {
    campaigns,
    runs,
    getRunsForCampaign,
    clearAllLogs,
    deleteRun,
    clearRunLogs,
    stopWorkflow,
    runnerStatus,
  } = useWorkflowRunner();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | "all">(() => (campaigns[0]?.id ?? "all"));
  const campaignRuns = useMemo(() => (selectedCampaignId === "all" ? runs : getRunsForCampaign(selectedCampaignId)), [selectedCampaignId, runs, getRunsForCampaign]);

  const [selectedRunId, setSelectedRunId] = useState<string | null>(() => campaignRuns[0]?.id ?? null);

  // when campaigns/runs change, keep selection reasonable
  useEffect(() => {
    if (selectedCampaignId === "all") {
      setSelectedRunId(runs[0]?.id ?? null);
    } else {
      setSelectedRunId(campaignRuns[0]?.id ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCampaignId, runs, campaigns.length]);

  useEffect(() => {
    // update selectedRunId if current isn't available
    if (selectedRunId && !runs.find((r) => r.id === selectedRunId)) {
      setSelectedRunId(runs[0]?.id ?? null);
    }
  }, [runs, selectedRunId]);

  const selectedRun = runs.find((r) => r.id === selectedRunId) ?? null;

  const handleDeleteRun = (id: string) => {
    if (!confirm("Delete this run and its logs?")) return;
    deleteRun(id);
    setSelectedRunId((prev) => (prev === id ? null : prev));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-64">
          <label className="block text-sm font-medium mb-1">Campaign</label>
          <select
            className="w-full border rounded p-2"
            value={selectedCampaignId ?? "all"}
            onChange={(e) => setSelectedCampaignId(e.target.value || "all")}
          >
            <option value="all">All runs</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name ?? c.id}
              </option>
            ))}
          </select>
        </div>

        <div className="w-64">
          <label className="block text-sm font-medium mb-1">Run</label>
          <select
            className="w-full border rounded p-2"
            value={selectedRunId ?? ""}
            onChange={(e) => setSelectedRunId(e.target.value || null)}
          >
            <option value="">Latest</option>
            {campaignRuns.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} — {new Date(r.startedAt).toLocaleString()} — {r.status}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex gap-2">
          <Button variant="ghost" onClick={() => stopWorkflow()} disabled={runnerStatus !== "running"}>
            Stop
          </Button>
          <Button variant="ghost" onClick={() => clearAllLogs()}>
            Clear All Logs
          </Button>
        </div>
      </div>

      <div className="border rounded p-2 max-h-[60vh] overflow-auto bg-white">
        {selectedRun ? (
          selectedRun.logs.length === 0 ? (
            <div className="text-sm text-gray-500">No logs for selected run.</div>
          ) : (
            selectedRun.logs
              .slice()
              .sort((a, b) => a.ts - b.ts)
              .map((l, i) => (
                <div key={i} className="mb-2">
                  <div className="text-xs text-gray-400">{new Date(l.ts).toLocaleString()}</div>
                  <div>
                    <span className="text-sm font-medium">{l.nodeId ? `[${l.nodeId}] ` : ""}</span>
                    <span className={l.level === "error" ? "text-red-600" : "text-gray-800"}>{l.message}</span>
                  </div>
                </div>
              ))
          )
        ) : runs.length === 0 ? (
          <div className="text-sm text-gray-500">No runs yet.</div>
        ) : (
          // If no run selected show latest global logs
          runs[0].logs.length === 0 ? (
            <div className="text-sm text-gray-500">No logs yet.</div>
          ) : (
            runs[0].logs
              .slice()
              .sort((a, b) => a.ts - b.ts)
              .map((l, i) => (
                <div key={i} className="mb-2">
                  <div className="text-xs text-gray-400">{new Date(l.ts).toLocaleString()}</div>
                  <div>
                    <span className="text-sm font-medium">{l.nodeId ? `[${l.nodeId}] ` : ""}</span>
                    <span className={l.level === "error" ? "text-red-600" : "text-gray-800"}>{l.message}</span>
                  </div>
                </div>
              ))
          )
        )}
      </div>

      {selectedRun && (
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => clearRunLogs(selectedRun.id)}>
            Clear Run Logs
          </Button>
          <Button variant="destructive" onClick={() => handleDeleteRun(selectedRun.id)}>
            Delete Run
          </Button>
          <div className="ml-auto text-sm text-muted-foreground">
            Status: <span className="font-medium">{selectedRun.status}</span>
          </div>
        </div>
      )}
    </div>
  );
}
