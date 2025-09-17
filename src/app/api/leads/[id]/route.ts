import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { leads, leadLists } from "@/lib/db/schema";
import type { Lead } from "@/lib/db";
import { eq } from "drizzle-orm";
import { updateLeadSchema } from "@/zodSchemas/LeadsSchemas";

const userId = 1; // 🔑 Simulate authentication



export async function GET(
  req: Request,
   contextParams : Promise<{ params: { id: string } }>
) {
    const { params } = await contextParams;
    const {id} = params
  const _id = Number(id);
  const lead = await db.query.leads.findFirst({
    where: eq(leads.id, _id),
    with: { leadList: true },
  });

  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  if (lead.leadList.userId !== userId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json(lead, { status: 200 });
}

export async function PUT(
  req: Request,
  contextParams : Promise<{ params: { id: string } }>
) {
    const { params } = await contextParams;
    let {id} =  params 

    const _id = Number( id);
  const body = await req.json();

  const parsed = updateLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.format() },
      { status: 400 }
    );
  }

  const lead = await db.query.leads.findFirst({
    where: eq(leads.id, _id),
    with: { leadList: true },
  });

  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  if (lead.leadList.userId !== userId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await db
    .update(leads)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(leads.id, _id))
    .returning();

  return NextResponse.json(updated[0] as Lead, { status: 200 });
}

export async function DELETE(
  req: Request,
  contextParams: Promise<{ params: { id: string } }>
) {
    const {params} = await contextParams
    const {id} = params
  const _id = Number(params.id);

  const lead = await db.query.leads.findFirst({
    where: eq(leads.id, _id),
    with: { leadList: true },
  });

  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  if (lead.leadList.userId !== userId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.delete(leads).where(eq(leads.id, _id));
  return new Response(null, { status: 204 });
}
