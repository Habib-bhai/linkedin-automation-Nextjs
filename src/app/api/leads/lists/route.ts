import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leadLists } from "@/lib/db/schema";
import type { LeadList } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

const userId = 1; // 🔑 Simulate authentication

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? 10);
  const offset = Number(searchParams.get("offset") ?? 0);
  const status = searchParams.get("status");

  const whereClause = status
    ? { userId, uploadStatus: status }
    : { userId };

  const rows = await db
    .select()
    .from(leadLists)
    .where(eq(leadLists.userId, userId))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(leadLists.createdAt));

  const total = await db.$count(leadLists, eq(leadLists.userId, userId));

  return NextResponse.json(
    {
      data: rows as LeadList[],
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    },
    { status: 200 }
  );
}
