"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NameCard } from "@/components/name-results/name-card";
import { BaziSummary } from "@/components/name-results/bazi-summary";
import type { NameCharacter } from "@/components/name-results/name-card";

// ── Types matching the API response ──

interface NameResult {
  chinese_name: string;
  pinyin: string;
  characters: NameCharacter[];
  fullMeaning: string;
  culturalStory: string;
  bestFor: string;
  pronunciationTip: string;
  is_locked: boolean;
}

interface BaziSummaryData {
  missing_elements: string[];
  hint: string;
}

interface ResultsData {
  names: NameResult[];
  bazi_summary: BaziSummaryData | null;
  total_names: number;
  locked_count: number;
}

// ── Page Component ──

/**
 * ResultsPage — displays free Chinese name results.
 *
 * Data flow:
 * 1. Reads from sessionStorage (set by the form wizard on submit)
 * 2. Redirects to `/create` if no data is found
 * 3. Renders:
 *    - Header with title + subtitle
 *    - 2-column grid of name cards (desktop) / single column (mobile)
 *    - Bazi insight summary banner (if available)
 *    - "Unlock Full Report" CTA button
 */
export default function ResultsPage() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params?.lang ?? "en";
  const t = useTranslations("results");

  const [data, setData] = useState<ResultsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("nameResults");
      if (!raw) {
        router.replace(`/${lang}/create`);
        return;
      }

      const parsed: ResultsData = JSON.parse(raw);

      if (!parsed.names || parsed.names.length === 0) {
        router.replace(`/${lang}/create`);
        return;
      }

      setData(parsed);
    } catch {
      router.replace(`/${lang}/create`);
    } finally {
      setIsLoading(false);
    }
  }, [lang, router]);

  /** Placeholder handler for unlocking — will integrate with payment in a future step */
  const handleUnlock = useCallback(() => {
    // TODO: Integrate with payment flow
    // router.push(`/${lang}/pricing`);
  }, []);

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="font-body text-text-tertiary text-sm">Loading...</div>
      </div>
    );
  }

  // ── No data (should redirect, but guard against flash) ──
  if (!data) {
    return null;
  }

  const { names, bazi_summary, total_names } = data;
  const unlockedCount = names.filter((n) => !n.is_locked).length;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-bg">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">
          {/* ── Page Header ── */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-text mb-3">
              {t("freeTitle")}
            </h1>
            <p className="font-body text-sm md:text-base text-text-tertiary max-w-xl mx-auto">
              {t("freeSubtitle", { total: total_names })}
            </p>
          </div>

          {/* ── Name Cards Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 md:mb-10">
            {names.map((name, index) => (
              <NameCard
                key={index}
                chineseName={name.chinese_name}
                pinyin={name.pinyin}
                characters={name.characters}
                isLocked={name.is_locked}
                isBestMatch={index === 0 && !name.is_locked}
                bestMatchLabel={t("bestMatch")}
                lockedOverlayLabel={t("lockedOverlay")}
                onUnlock={handleUnlock}
              />
            ))}
          </div>

          {/* ── Bazi Summary ── */}
          {bazi_summary && (
            <div className="mb-8 md:mb-10">
              <BaziSummary
                missingElements={bazi_summary.missing_elements}
                hint={bazi_summary.hint}
                title={t("baziSummaryTitle")}
              />
            </div>
          )}

          {/* ── Unlock Full Report CTA ── */}
          <div className="text-center">
            <p className="font-body text-sm text-text-tertiary mb-4">
              {unlockedCount} of {total_names} names unlocked
            </p>
            <button
              type="button"
              onClick={handleUnlock}
              className="btn btn-primary btn-lg"
            >
              {t("unlockCta")}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
