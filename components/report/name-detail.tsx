"use client";

import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────

export interface ReportCharacter {
  char: string;
  meaning: string;
  element: string;
  source: string;
}

export interface ReportNameDetailProps {
  /** Full Chinese name string (e.g. "李美琳") */
  chineseName: string;
  /** Pinyin romanization (e.g. "Lǐ Měilín") */
  pinyin: string;
  /** Per-character breakdown with meaning, element, and source */
  characters: ReportCharacter[];
  /** Overall meaning description */
  fullMeaning: string;
  /** Cultural story / historical reference */
  culturalStory: string;
  /** Pronunciation tip for non-native speakers */
  pronunciationTip: string;
  /** Best-for recommendation context */
  bestFor: string;
  /** Whether this is the "Best Match" pick */
  isBestMatch?: boolean;
  /** Best match label (i18n-aware) */
  bestMatchLabel?: string;
  /** Ranking index */
  index?: number;
}

// ── Element Color Map ──

const ELEMENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "金": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "木": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "水": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "火": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  "土": { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
};

const DEFAULT_ELEMENT_COLOR = { bg: "bg-surface-alt", text: "text-text-tertiary", border: "border-border-light" };

function getElementColor(element: string) {
  return ELEMENT_COLORS[element] ?? DEFAULT_ELEMENT_COLOR;
}

// ── Component ──

/**
 * NameDetail — renders a single Chinese name in full detail.
 *
 * Design spec:
 * - Chinese characters at 48px (text-5xl), serif font (font-cjk), primary color
 * - Pinyin below in text-text-secondary
 * - Per-character breakdown: element badge, character, meaning, source
 * - Cultural story in a subtle card
 * - Pronunciation guide
 * - Best-for recommendation
 */
export function NameDetail({
  chineseName,
  pinyin,
  characters,
  fullMeaning,
  culturalStory,
  pronunciationTip,
  bestFor,
  isBestMatch = false,
  bestMatchLabel = "Best Match",
  index = 0,
}: ReportNameDetailProps) {
  return (
    <div className="bg-surface rounded-xl border border-border-light shadow-sm overflow-hidden">
      {/* ── Header with Ranking ── */}
      <div className="flex items-center justify-between px-6 md:px-8 pt-6 md:pt-8 pb-0">
        <span className="text-xs font-semibold text-text-muted tracking-wider uppercase">
          Name {index + 1}
        </span>
        {isBestMatch && (
          <span className="bg-primary-light text-primary text-xs font-semibold px-3 py-1 rounded-full">
            {bestMatchLabel}
          </span>
        )}
      </div>

      {/* ── Name Display ── */}
      <div className="px-6 md:px-8 py-5 text-center border-b border-border-light">
        {/* Chinese Characters — 48px */}
        <div className="text-5xl md:text-6xl font-cjk text-primary mb-2 leading-tight tracking-wide">
          {chineseName}
        </div>

        {/* Pinyin */}
        <div className="text-base md:text-lg text-text-secondary font-body">
          {pinyin}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-6 md:px-8 py-6 space-y-6">
        {/* Full Meaning */}
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Meaning
          </h4>
          <p className="text-sm md:text-base text-text leading-relaxed">
            {fullMeaning}
          </p>
        </div>

        {/* Per-Character Breakdown */}
        {characters.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Character Analysis
            </h4>
            <div className="space-y-3">
              {characters.map((char, i) => {
                const color = getElementColor(char.element);
                return (
                  <div key={i} className="flex items-start gap-3">
                    {/* Element Badge */}
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-8 h-8 rounded-md border text-xs font-bold shrink-0 mt-0.5",
                        color.bg,
                        color.text,
                        color.border
                      )}
                      title={`Element: ${char.element}`}
                    >
                      {char.element}
                    </span>

                    {/* Character + Meaning + Source */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-cjk text-xl text-text">{char.char}</span>
                        <span className="text-sm text-text-secondary">— {char.meaning}</span>
                      </div>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed italic">
                        &ldquo;{char.source}&rdquo;
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cultural Story */}
        {culturalStory && (
          <div className="bg-surface-alt rounded-lg p-4 md:p-5">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Cultural Story
            </h4>
            <p className="text-sm md:text-base text-text leading-relaxed">
              {culturalStory}
            </p>
          </div>
        )}

        {/* Pronunciation Guide + Best For — side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pronunciationTip && (
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Pronunciation Guide
              </h4>
              <p className="text-sm text-text leading-relaxed">
                {pronunciationTip}
              </p>
            </div>
          )}
          {bestFor && (
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Best For
              </h4>
              <p className="text-sm text-text leading-relaxed">
                {bestFor}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
