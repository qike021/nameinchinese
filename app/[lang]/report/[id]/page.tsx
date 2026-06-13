/**
 * Report Page — full Chinese name report for paid users.
 *
 * Shows all names in vertical detail, Bazi analysis (if available),
 * and a "Download PDF" button. Fetches via Supabase REST API.
 */
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ReportClient } from "./report-client";

interface ReportPageProps {
  params: Promise<{ lang: string; id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { lang, id } = await params;

  // ── Fetch via Supabase REST API ──
  const adminClient = createAdminClient();
  const { data: record, error } = await adminClient
    .from("generated_names")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !record) {
    notFound();
  }

  // Safe extraction with type guards
  const names = Array.isArray(record.names) ? record.names : [];
  const baziResult = record.bazi_result &&
    typeof record.bazi_result === "object" &&
    "day_master" in record.bazi_result
    ? record.bazi_result
    : null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16">
          {/* ── Page Header ── */}
          <div className="text-center mb-10 md:mb-12">
            <div className="inline-flex items-center gap-1.5 bg-primary-light text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>Pro Report</span>
            </div>

            <h1 className="font-heading text-3xl md:text-4xl font-bold text-text mb-3">
              Your Complete Chinese Name Report
            </h1>
            <p className="font-body text-sm md:text-base text-text-tertiary max-w-xl mx-auto">
              A name rooted in 3,000 years of poetry and philosophy
            </p>
          </div>

          {/* ── Download PDF Button ── */}
          <div className="flex justify-center mb-10">
            <a
              href={`/api/report/${id}`}
              download
              className="btn btn-primary btn-lg inline-flex items-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF Report
            </a>
          </div>

          {/* ── Delegate to client component for interactive rendering ── */}
          <ReportClient
            names={names}
            baziResult={baziResult}
            reportId={id}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
