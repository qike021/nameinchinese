"use client";

/**
 * BaziSummary — A banner showing the Five Elements (Bazi) insight.
 *
 * Displays which elements are missing from the user's Bazi chart
 * and a contextual hint about how name characters can help balance them.
 *
 * Design spec:
 * - Amber/amber background banner
 * - Title: "☯ Five Elements Insight"
 * - Missing elements listed as tags
 * - Hint text below
 */

export interface BaziSummaryProps {
  /** The Five Elements missing from the user's chart (e.g. ["金", "水"]) */
  missingElements: string[];
  /** Human-readable hint about element balancing */
  hint: string;
  /** Title label (i18n-aware) */
  title?: string;
}

/**
 * Map each Five Element to a display color for the missing-element tags.
 */
const ELEMENT_TAG_COLORS: Record<string, { bg: string; text: string }> = {
  "金": { bg: "bg-amber-100", text: "text-amber-800" },
  "木": { bg: "bg-emerald-100", text: "text-emerald-800" },
  "水": { bg: "bg-blue-100", text: "text-blue-800" },
  "火": { bg: "bg-red-100", text: "text-red-800" },
  "土": { bg: "bg-yellow-100", text: "text-yellow-800" },
};

const DEFAULT_TAG_COLOR = { bg: "bg-amber-100", text: "text-amber-800" };

function getTagColor(element: string) {
  return ELEMENT_TAG_COLORS[element] ?? DEFAULT_TAG_COLOR;
}

export function BaziSummary({
  missingElements,
  hint,
  title = "☯ Five Elements Insight",
}: BaziSummaryProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 md:p-6">
      {/* Title */}
      <h3 className="font-heading text-lg font-semibold text-amber-900 mb-3">
        {title}
      </h3>

      {/* Missing Elements */}
      {missingElements.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-sm font-medium text-amber-800">Missing:</span>
          {missingElements.map((element) => {
            const color = getTagColor(element);
            return (
              <span
                key={element}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${color.bg} ${color.text}`}
              >
                {element}
              </span>
            );
          })}
        </div>
      )}

      {/* Hint */}
      <p className="text-sm text-amber-800 leading-relaxed">{hint}</p>
    </div>
  );
}
