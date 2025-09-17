// /app/api/runs/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  campaignRuns,
  campaigns,
  campaignRunLeads,
  campaignLogs,
  workflowDefinitions,
} from "@/lib/db/schema";
import type { CampaignRun } from "@/lib/db";
import { eq,sql } from "drizzle-orm";

/* Placeholder user id for now */
const userId = 1;

/* Helper to parse route id param */
function parseIdParam(idParam: string | string[] | undefined) {
  if (Array.isArray(idParam)) return { error: "Invalid id parameter" };
  if (!idParam) return { error: "Missing id parameter" };
  const _id = Number(idParam);
  if (!Number.isFinite(_id) || Number.isNaN(_id) || _id <= 0) return { error: "Invalid id parameter" };
  return { _id };
}

/* ---------- GET: fetch campaign run with details ---------- */
export async function GET(_request: Request, contextPromise : Promise<{ params: { id?: string } }>) {
  try {
    const { params } = await contextPromise;
    const {id} = await params
    const { _id, error } = parseIdParam(id);
    if (error) return NextResponse.json({ error }, { status: 400 });

    // Fetch the run
    const runRows = await db.select().from(campaignRuns).where(eq(campaignRuns.id, _id!)).limit(1);
    const run = Array.isArray(runRows) ? runRows[0] : runRows;
    if (!run) return NextResponse.json({ error: "Campaign run not found" }, { status: 404 });

    // if (run.id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Fetch campaign basic info
    const campaignRows = await db.select().from(campaigns).where(eq(campaigns.id, run.campaignId)).limit(1);
    const campaign = Array.isArray(campaignRows) ? campaignRows[0] : campaignRows;

    // Fetch workflow definition info (if needed)
    const wfRows = await db
      .select()
      .from(workflowDefinitions)
      .where(eq(workflowDefinitions.id, run.workflowDefinitionId))
      .limit(1);
    const workflow = Array.isArray(wfRows) ? wfRows[0] : wfRows;

    // Statistics: count leads grouped by status
    const leadRows = await db
      .select({
        total: sql.raw("count(*)"),
        pending: sql.raw("count(*) FILTER (WHERE status = 'pending')"),
        sent: sql.raw("count(*) FILTER (WHERE status = 'sent')"),
        failed: sql.raw("count(*) FILTER (WHERE status = 'failed')"),
        completed: sql.raw("count(*) FILTER (WHERE status = 'completed')"),
      })
      .from(campaignRunLeads)
      .where(eq(campaignRunLeads.id, _id!));

    // Drizzle `select` with aggregates may return array with one element
    const stats = Array.isArray(leadRows) ? leadRows[0] : leadRows;

    // Optionally include recent logs summary (latest 20)
    const logs = await db
      .select()
      .from(campaignLogs)
      .where(eq(campaignLogs.id, _id!))
      .limit(20);

    const response = {
      run: run as CampaignRun,
      campaign,
      workflow,
      stats,
      recentLogs: Array.isArray(logs) ? logs : [logs],
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("GET /api/runs/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/* ---------- DELETE: cancel a running/queued campaign run ---------- */
export async function DELETE(_request: Request, contextParams : Promise<{ params: { id?: string } }>) {
  try {
    const {params} = await contextParams
    const {id} = params
    const { _id, error } = parseIdParam(id);
    if (error) return NextResponse.json({ error }, { status: 400 });

    // Fetch run and check ownership
    const runRows = await db.select().from(campaignRuns).where(eq(campaignRuns.id, _id!)).limit(1);
    const run = Array.isArray(runRows) ? runRows[0] : runRows;
    if (!run) return NextResponse.json({ error: "Campaign run not found" }, { status: 404 });

    // if (run.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Update status to 'canceled' only if not in a terminal state
    if (["completed", "failed", "canceled"].includes(run.status)) {
      // already terminal — nothing to change
      return new NextResponse(null, { status: 204 });
    }

    const now = new Date();
    await db
      .update(campaignRuns)
      .set({ status: "canceled", updatedAt: now, endedAt: now })
      .where(eq(campaignRuns.id, _id!))
      .execute();

    // TODO: trigger cancellation in your job/worker system
    // For now: log a placeholder
    setTimeout(() => {
      console.log(`[Queue] Request cancellation for run ${_id}`);
      // e.g. queue.removeJobs or send cancel message to workers
    }, 0);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/runs/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
