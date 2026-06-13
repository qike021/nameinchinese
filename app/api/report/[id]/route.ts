/**
 * GET /api/report/[id]
 *
 * Downloads a PDF report for a generated_names record.
 * Fetches via Supabase REST API, generates PDF with @react-pdf/renderer.
 */
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

    // ── Fetch via Supabase REST ──
    const adminClient = createAdminClient();
    const { data: record, error } = await adminClient
      .from("generated_names")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !record) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    // ── Generate PDF ──
    const names = (record.names || []) as GeneratedName[];
    const baziResult = record.bazi_result as BaziResult | null;
    const englishName = record.english_name || "User";

    const pdfBuffer = await generatePDF({
      englishName,
      names,
      baziResult,
    });

    // ── Return PDF as downloadable file ──
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="nameinchinese-report-${englishName.replace(/[\s<>:"/\\|?*]+/g, "-").toLowerCase()}.pdf"`,
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
