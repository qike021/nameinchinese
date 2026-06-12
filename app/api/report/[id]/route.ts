/**
 * GET /api/report/[id]
 *
 * Downloads a PDF report for a generated_names record.
 * Looks up the record, generates a PDF with @react-pdf/renderer,
 * and returns it as a downloadable file.
 */
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { generatedNames } from "@/db/schema";
import { generatePDF } from "@/lib/report/pdf-generator";
import type { GeneratedName } from "@/lib/naming/engine";
import type { BaziResult } from "@/lib/bazi/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Report ID is required" },
        { status: 400 }
      );
    }

    // ── Look up the generated_names record ──
    const [record] = await db
      .select()
      .from(generatedNames)
      .where(eq(generatedNames.id, id))
      .limit(1);

    if (!record) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    // ── Generate PDF ──
    const names = (record.names || []) as GeneratedName[];
    const baziResult = record.baziResult as BaziResult | null;

    const pdfBuffer = await generatePDF({
      englishName: record.englishName,
      names,
      baziResult,
    });

    // ── Return PDF as downloadable file ──
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="nameinchinese-report-${record.englishName.replace(/\s+/g, "-").toLowerCase()}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error("[API] PDF generation failed:", error);

    const message =
      error instanceof Error ? error.message : "Failed to generate PDF";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
