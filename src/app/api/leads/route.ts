import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parse } from "csv-parse/sync";
import { db } from "@/lib/db";
import { leadLists, leads } from "@/lib/db/schema";
import type { NewLead, LeadList } from "@/lib/db";
import { eq } from "drizzle-orm";
import { fileSchema } from "@/zodSchemas/LeadsSchemas";

const userId = 1; // 🔑 Simulate authentication


// --- POST handler ---
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    const parsedFile = fileSchema.safeParse(file);
    if (!parsedFile.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsedFile.error.format() },
        { status: 400 }
      );
    }

    const csvFile = parsedFile.data as File;
    const buffer = Buffer.from(await csvFile.arrayBuffer());
    const records = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    // --- Validate CSV structure ---
    const requiredCols = ["firstName", "lastName", "email"];
    for (const col of requiredCols) {
      if (!records[0]?.[col]) {
        return NextResponse.json(
          { error: `Missing required column: ${col}` },
          { status: 400 }
        );
      }
    }

    let createdList: LeadList | null = null;

    await db.transaction(async (tx) => {
      // 1) Create LeadList
      const insertedList = await tx
        .insert(leadLists)
        .values({
          userId,
          name: csvFile.name.replace(".csv", ""),
          originalFilename: csvFile.name,
          uploadStatus: "processing",
        })
        .returning();
      createdList = insertedList[0];

      // 2) Chunk leads (prevent large inserts)
      const chunkSize = 500;
      for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize);

        const leadData: NewLead[] = chunk.map((row) => ({
          leadListId: createdList!.id,
          firstName: row.firstName ?? null,
          lastName: row.lastName ?? null,
          email: row.email ?? null,
          company: row.company ?? null,
          position: row.position ?? null,
          profileUrl: row.profileUrl ?? null,
        }));

        await tx.insert(leads).values(leadData);
      }

      // 3) Update lead list count + status
      await tx
        .update(leadLists)
        .set({
          count: records.length,
          uploadStatus: "completed",
        })
        .where(eq(leadLists.id, createdList!.id))
    });

    return NextResponse.json(createdList, { status: 201 });
  } catch (err) {
    console.error("CSV Upload Error:", err);
    return NextResponse.json(
      { error: "Failed to process CSV upload" },
      { status: 500 }
    );
  }
}
