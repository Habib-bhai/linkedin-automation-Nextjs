// /app/api/runs/[id]/logs/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaignRuns, campaignLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/* placeholder user */
const userId = 1;

/* parse id helper */
function parseIdParam(idParam: string | string[] | undefined) {
  if (Array.isArray(idParam)) return { error: "Invalid id parameter" };
  if (!idParam) return { error: "Missing id parameter" };
  const id = Number(idParam);
  if (!Number.isFinite(id) || Number.isNaN(id) || id <= 0) return { error: "Invalid id parameter" };
  return { id };
}

/* Format a JS object as an SSE event string */
function sseEvent(event: string | null, data: unknown) {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  let str = "";
  if (event) str += `event: ${event}\n`;
  // split payload by newlines and prefix with "data:"
  payload.split(/\n/).forEach((line: string) => {
    str += `data: ${line}\n`;
  });
  str += `\n`;
  return str;
}

/* GET: SSE stream of logs */
export async function GET(request: Request, { params }: { params: { id?: string } }) {
  try {
    const { id, error } = parseIdParam(params.id);
    if (error) return NextResponse.json({ error }, { status: 400 });

    // Validate run existence & ownership
    const runRows = await db.select().from(campaignRuns).where(eq(campaignRuns.id, id!)).limit(1);
    const run = Array.isArray(runRows) ? runRows[0] : runRows;
    if (!run) return NextResponse.json({ error: "Campaign run not found" }, { status: 404 });
    // if (run.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Use ReadableStream to push SSE events
    const stream = new ReadableStream({
      async start(controller) {
        // helper to push event
        const push = (chunk: string) => {
          controller.enqueue(new TextEncoder().encode(chunk));
        };

        // Send initial SSE headers/message
        push(sseEvent("connected", { message: `Subscribed to run ${id} logs` }));

        // 1) Send all existing logs
        const existingLogs = await db.select().from(campaignLogs).where(eq(campaignLogs.campaignRunId, id!)).orderBy(campaignLogs.timestamp);
        let lastLogId = -1;
        if (Array.isArray(existingLogs) && existingLogs.length > 0) {
          for (const log of existingLogs) {
            push(sseEvent("log", log));
            lastLogId = Math.max(lastLogId, (log as any).id ?? lastLogId);
          }
        }

        // 2) Poll for new logs periodically
        const pollInterval = 2000; // ms
        let canceled = false;

        // Close stream when run reaches terminal state
        const isTerminal = (status: string) => ["completed", "failed", "canceled"].includes(status);

        // periodic poll
        const interval = setInterval(async () => {
          if (canceled) return;
          try {
            // re-fetch run status
            const runRowsNow = await db.select().from(campaignRuns).where(eq(campaignRuns.id, id!)).limit(1);
            const runNow = Array.isArray(runRowsNow) ? runRowsNow[0] : runRowsNow;
            if (!runNow) {
              push(sseEvent("error", { message: "Run disappeared" }));
              controller.close();
              clearInterval(interval);
              canceled = true;
              return;
            }

            // Fetch new logs with id > lastLogId (or createdAt > last known)
            // We try to use id if available, otherwise createdAt
            const newLogs = lastLogId > -1
              ? await db
                  .select()
                  .from(campaignLogs)
                  .where(eq(campaignLogs.campaignRunId, id!) /* add more: id > lastLogId isn't expressible without SQL fragment here; use createdAt fallback */)
                  .orderBy(campaignLogs.timestamp)
              : await db
                  .select()
                  .from(campaignLogs)
                  .where(eq(campaignLogs.campaignRunId, id!))
                  .orderBy(campaignLogs.timestamp);

            // In absence of a numeric id filter, just iterate and send logs with timestamp/newness detection
            // Track latest createdAt to avoid re-sending; we'll scan and send those created after the last sent time.
            // For simplicity, we'll send any logs not yet counted by comparing to lastLogId by checking for uniqueness.
            for (const log of Array.isArray(newLogs) ? newLogs : [newLogs]) {
              const lid = (log as any).id ?? ((log as any).createdAt ? new Date((log as any).createdAt).getTime() : null);
              if (typeof lid === "number" && lid > lastLogId) {
                push(sseEvent("log", log));
                lastLogId = Math.max(lastLogId, lid);
              }
            }

            // If run reached terminal state, send final event and close
            if (isTerminal(runNow.status)) {
              push(sseEvent("end", { status: runNow.status }));
              controller.close();
              clearInterval(interval);
              canceled = true;
              return;
            }
          } catch (err) {
            console.error("SSE poll error:", err);
            push(sseEvent("error", { message: "Internal server error during logs polling" }));
            controller.close();
            clearInterval(interval);
            canceled = true;
          }
        }, pollInterval);

        // handle client abort (request.signal)
        const abortHandler = () => {
          clearInterval(interval);
          canceled = true;
          controller.close();
        };

        // listen to request abort
        (request.signal as AbortSignal).addEventListener("abort", abortHandler);

        // When stream is closed, clean up
        controller.close = () => {
          clearInterval(interval);
          canceled = true;
          (request.signal as AbortSignal).removeEventListener("abort", abortHandler);
        };
      },
    });

    const headers = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    };

    return new Response(stream, { status: 200, headers });
  } catch (err) {
    console.error("GET /api/runs/[id]/logs error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
