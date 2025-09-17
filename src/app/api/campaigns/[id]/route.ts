// /app/api/campaigns/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema";
import type { Campaign } from "@/lib/db";
import { eq } from "drizzle-orm";
import { updateCampaignSchema } from "@/zodSchemas/CampaignSchemas";
/**
 * Temporary authenticated user placeholder.
 * Replace with your auth logic (session / token).
 */
const userId = 1;



/* ---------- Helper: parse id param as number ---------- */
function parseIdParam(idParam: string | string[] | undefined): { id?: number; error?: string } {
  if (Array.isArray(idParam)) return { error: "Invalid id parameter" };
  if (!idParam) return { error: "Missing id parameter" };
  const id = Number(idParam);
  if (!Number.isFinite(id) || Number.isNaN(id) || id <= 0) return { error: "Invalid id parameter" };
  return { id };
}

/* ---------- GET /api/campaigns/:id ---------- */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const { id, error } = parseIdParam(params.id);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const row = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id!))
      .limit(1);

    const campaign = (Array.isArray(row) ? row[0] : row) as Campaign | undefined;

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Ownership check
    if (campaign.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(campaign, { status: 200 });
  } catch (err) {
    console.error("GET /api/campaigns/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/* ---------- PUT (update) /api/campaigns/:id ---------- */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const { id, error } = parseIdParam(params.id);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const parsed = updateCampaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const updates = parsed.data;

    // Fetch existing campaign to validate existence & ownership
    const existingRows = await db.select().from(campaigns).where(eq(campaigns.id, id!)).limit(1);
    const existing = (Array.isArray(existingRows) ? existingRows[0] : existingRows) as Campaign | undefined;

    if (!existing) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (existing.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Prepare update object (only include fields that were provided)
    const updatedAt = new Date();
    const updateObj: Partial<Record<string, unknown>> = { updatedAt };

    if (typeof updates.name !== "undefined") updateObj.name = updates.name;
    if (typeof updates.description !== "undefined") updateObj.description = updates.description;

    // If nothing to update (client sent empty body) -> 400
    if (Object.keys(updateObj).length === 1 && "updatedAt" in updateObj) {
      return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
    }

    // Perform type-safe update and return the updated row
    const updatedRows = await db
      .update(campaigns)
      .set(updateObj)
      .where(eq(campaigns.id, id!))
      .returning();

    const updated = (Array.isArray(updatedRows) ? updatedRows[0] : updatedRows) as Campaign;

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("PUT /api/campaigns/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/* ---------- DELETE /api/campaigns/:id ---------- */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id?: string } }
) {
  try {
    const { id, error } = parseIdParam(params.id);
    if (error) return NextResponse.json({ error }, { status: 400 });

    // Verify campaign exists & belongs to user
    const existingRows = await db.select().from(campaigns).where(eq(campaigns.id, id!)).limit(1);
    const existing = (Array.isArray(existingRows) ? existingRows[0] : existingRows) as Campaign | undefined;

    if (!existing) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (existing.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Perform delete
    await db.delete(campaigns).where(eq(campaigns.id, id!)).execute();

    // 204 No Content
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/campaigns/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
