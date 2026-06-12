"use client";

import { cn } from "@/lib/utils";

/**
 * Element color map for the Five Elements badges.
 * Each element gets a distinct color scheme for visual differentiation.
 */
const ELEMENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "金": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "木": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "水": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "火": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  "土": { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
};

const DEFAULT_ELEMENT_COLOR = { bg: "bg-surface-alt", text: "text-text-tertiary", border: "border-border-light" };

/**
 * Get color scheme for a Five Element, falling back to defaults.
 */
function getElementColor(element: string) {
  return ELEMENT_COLORS[element] ?? DEFAULT_ELEMENT_COLOR;
}

// ── Types ─────────────────────────────────────────────

export interface NameCharacter {
  char: string;
  meaning: string;
  element: string;
  source: string;
}

export interface NameCardProps {
  /** Full Chinese name string (e.g. "李美琳") */
  chineseName: string;
  /** Pinyin romanization (e.g. "Lǐ Měilín") */
  pinyin: string;
  /** Per-character breakdown with meaning, element, and source */
  characters: NameCharacter[];
  /** Whether this card is locked (blurred + overlay) */
  isLocked: boolean;
  /** Whether to show the "Best Match" badge */
  isBestMatch?: boolean;
  /** Label for the "Best Match" badge */
  bestMatchLabel?: string;
  /** Label for the locked overlay button */
  lockedOverlayLabel?: string;
  /** Optional unlock callback */
  onUnlock?: () => void;
}

/**
 * NameCard — renders a single Chinese name result.
 *
 * Two visual states:
 * - **Unlocked**: Full detail with Best Match badge, large CJK characters,
 *   pinyin, and per-character analysis (element badge, meaning, source).
 * - **Locked**: Content blurred with a semi-transparent overlay containing
 *   an unlock CTA.
 */
export function NameCard({
  chineseName,
  pinyin,
  characters,
  isLocked,
  isBestMatch = false,
  bestMatchLabel = "Best Match",
  lockedOverlayLabel = "Unlock Full Report",
  onUnlock,
}: NameCardProps) {
  return (
    <div
      className={cn(
        "relative bg-surface rounded-xl border shadow-sm overflow-hidden",
        isLocked ? "border-border" : "border-border-light"
      )}
    >
      {/* ── Best Match Badge ── */}
      {isBestMatch && (
        <div className="absolute top-4 left-4 z-10 bg-primary-light text-primary text-xs font-semibold px-3 py-1 rounded-full">
          {bestMatchLabel}
        </div>
      )}

      {/* ── Card Content ── */}
      <div
        className={cn(
          "p-6 md:p-8",
          isLocked && "blur-sm opacity-30 select-none pointer-events-none"
        )}
      >
        {/* Chinese Name — 64px (text-6xl) */}
        <div className="text-6xl md:text-7xl font-cjk text-primary text-center mb-2 leading-tight">
          {chineseName}
        </div>

        {/* Pinyin */}
        <div className="text-base md:text-lg text-text-secondary text-center mb-6">
          {pinyin}
        </div>

        {/* Per-Character Breakdown */}
        {characters.length > 0 && (
          <div className="space-y-3">
            {characters.map((char, i) => {
              const color = getElementColor(char.element);
              return (
                <div key={i} className="flex items-start gap-3">
                  {/* Element Badge */}
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-8 h-8 rounded-md border text-xs font-bold shrink-0",
                      color.bg,
                      color.text,
                      color.border
                    )}
                    title={`Element: ${char.element}`}
                  >
                    {char.element}
                  </span>

                  {/* Character Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-cjk text-lg text-text">{char.char}</span>
                      <span className="text-sm text-text-secondary">— {char.meaning}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                      {char.source}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Lock Overlay ── */}
      {isLocked && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 z-20">
          <p className="text-base font-semibold text-text">{lockedOverlayLabel}</p>
          <button
            type="button"
            onClick={onUnlock}
            className="btn btn-primary btn-md"
            aria-label={lockedOverlayLabel}
          >
            {lockedOverlayLabel}
          </button>
        </div>
      )}
    </div>
  );
}
