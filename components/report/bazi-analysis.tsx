"use client";

import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────

export interface BaziAnalysisProps {
  /** Four Pillars: year pillar (天干地支) */
  yearPillar: string;
  /** Four Pillars: month pillar */
  monthPillar: string;
  /** Four Pillars: day pillar */
  dayPillar: string;
  /** Four Pillars: hour pillar */
  hourPillar: string;
  /** Day master heavenly stem (日主) */
  dayMaster: string;
  /** Day master's associated Five Element */
  dayMasterElement: string;
  /** Five Elements distribution as a map of element -> count */
  fiveElements: Record<string, number>;
  /** Elements missing from the chart */
  missingElements: string[];
  /** Human-readable explanation of the day master */
  dayMasterExplanation?: string;
  /** Title label (i18n-aware) */
  title?: string;
  /** Day master label (i18n-aware) */
  dayMasterLabel?: string;
  /** Five elements chart label (i18n-aware) */
  fiveElementsLabel?: string;
  /** Missing elements label (i18n-aware) */
  missingElementsLabel?: string;
}

// ── Element Display Config ──

const ELEMENT_CONFIG: Record<string, { label: string; bg: string; text: string; bar: string }> = {
  "金": { label: "Metal", bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-400" },
  "木": { label: "Wood", bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-400" },
  "水": { label: "Water", bg: "bg-blue-50", text: "text-blue-700", bar: "bg-blue-400" },
  "火": { label: "Fire", bg: "bg-red-50", text: "text-red-700", bar: "bg-red-400" },
  "土": { label: "Earth", bg: "bg-yellow-50", text: "text-yellow-700", bar: "bg-yellow-400" },
};

const DEFAULT_ELEMENT = { label: "Unknown", bg: "bg-surface-alt", text: "text-text-tertiary", bar: "bg-stone-300" };

function getElementConfig(element: string) {
  return ELEMENT_CONFIG[element] ?? DEFAULT_ELEMENT;
}

const ALL_ELEMENTS = ["金", "木", "水", "火", "土"];

// ── Component ──

/**
 * BaziAnalysis — full Bazi (八字) analysis display.
 *
 * Shows:
 * - Four Pillars in a 4-column grid
 * - Five Elements distribution as horizontal bars
 * - Missing elements tags
 * - Day master explanation
 */
export function BaziAnalysis({
  yearPillar,
  monthPillar,
  dayPillar,
  hourPillar,
  dayMaster,
  dayMasterElement,
  fiveElements,
  missingElements,
  dayMasterExplanation,
  title = "Five Elements & Bazi Analysis",
  dayMasterLabel = "Day Master",
  fiveElementsLabel = "Five Elements Distribution",
  missingElementsLabel = "Missing Elements",
}: BaziAnalysisProps) {
  const maxCount = Math.max(1, ...Object.values(fiveElements));

  return (
    <div className="bg-surface rounded-xl border border-border-light shadow-sm overflow-hidden">
      {/* ── Title ── */}
      <div className="px-6 md:px-8 pt-6 pb-4 border-b border-border-light">
        <h3 className="font-heading text-xl font-semibold text-text">
          {title}
        </h3>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* ── Four Pillars ── */}
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
            Four Pillars (四柱)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Year", pillar: yearPillar },
              { label: "Month", pillar: monthPillar },
              { label: "Day", pillar: dayPillar },
              { label: "Hour", pillar: hourPillar },
            ].map((p) => (
              <div
                key={p.label}
                className="bg-surface-alt rounded-lg p-3 md:p-4 text-center"
              >
                <span className="text-xs font-medium text-text-tertiary block mb-1">
                  {p.label}
                </span>
                <span className="font-cjk text-lg md:text-xl font-semibold text-text">
                  {p.pillar}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Day Master ── */}
        <div className="bg-primary-light rounded-lg p-4 md:p-5">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              {dayMasterLabel}
            </h4>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-cjk text-3xl md:text-4xl font-bold text-primary">
              {dayMaster}
            </span>
            <span className={cn(
              "text-sm font-semibold px-2 py-0.5 rounded-md",
              getElementConfig(dayMasterElement).bg,
              getElementConfig(dayMasterElement).text,
            )}>
              {dayMasterElement} ({getElementConfig(dayMasterElement).label})
            </span>
          </div>
          {dayMasterExplanation && (
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              {dayMasterExplanation}
            </p>
          )}
        </div>

        {/* ── Five Elements Distribution ── */}
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
            {fiveElementsLabel}
          </h4>
          <div className="space-y-3">
            {ALL_ELEMENTS.map((element) => {
              const count = fiveElements[element] || 0;
              const config = getElementConfig(element);
              const percentage = (count / maxCount) * 100;

              return (
                <div key={element} className="flex items-center gap-3">
                  {/* Element Label */}
                  <span className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-md border text-xs font-bold shrink-0",
                    config.bg,
                    config.text,
                    element === dayMasterElement ? "border-current ring-2 ring-current/20" : "border-border-light"
                  )}>
                    {element}
                  </span>

                  {/* Bar */}
                  <div className="flex-1 h-4 bg-surface-alt rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", config.bar)}
                      style={{ width: `${Math.max(percentage, count > 0 ? 8 : 0)}%` }}
                    />
                  </div>

                  {/* Count */}
                  <span className="text-xs font-medium text-text-secondary w-5 text-right tabular-nums">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Missing Elements ── */}
        {missingElements.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              {missingElementsLabel}
            </h4>
            <div className="flex flex-wrap gap-2">
              {missingElements.map((element) => {
                const config = getElementConfig(element);
                return (
                  <span
                    key={element}
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold border",
                      config.bg,
                      config.text,
                      "border-current/20"
                    )}
                  >
                    {element} ({config.label})
                  </span>
                );
              })}
            </div>
            <p className="text-sm text-text-tertiary mt-3 leading-relaxed">
              Your chart is missing these elements. Choosing Chinese name characters with these elements can help restore Five Elements harmony.
            </p>
          </div>
        )}

        {/* ── All Elements Present ── */}
        {missingElements.length === 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-sm text-emerald-800 leading-relaxed">
              Your Five Elements are balanced. No elements are missing from your chart.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
