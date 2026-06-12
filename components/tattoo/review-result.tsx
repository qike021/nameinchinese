"use client";

interface ReviewData {
  status: "safe" | "warning" | "danger";
  actualMeaning: string;
  intendedMeaning: string;
  issues: string[];
  suggestion: string;
  explanation: string;
}

interface ReviewResultProps {
  review: ReviewData;
}

const statusConfig = {
  safe: {
    label: "Safe to Use",
    badgeClass: "bg-success/15 text-success border-success/30",
    icon: "✅",
  },
  warning: {
    label: "Use with Caution",
    badgeClass: "bg-warning/15 text-warning border-warning/30",
    icon: "⚠️",
  },
  danger: {
    label: "Do NOT Use",
    badgeClass: "bg-error/15 text-error border-error/30",
    icon: "🚫",
  },
} as const;

export function ReviewResult({ review }: ReviewResultProps) {
  const config = statusConfig[review.status];

  return (
    <div className="bg-surface rounded-2xl shadow-md p-6 md:p-8 border border-border-light">
      {/* ── Status Badge ── */}
      <div className="flex items-center gap-3 mb-6">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${config.badgeClass}`}
        >
          <span>{config.icon}</span>
          <span>{config.label}</span>
        </span>
      </div>

      {/* ── Meanings ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-bg rounded-xl p-4 border border-border-light">
          <p className="font-body text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">
            Actual Meaning
          </p>
          <p className="font-body text-sm text-text">
            {review.actualMeaning}
          </p>
        </div>
        <div className="bg-bg rounded-xl p-4 border border-border-light">
          <p className="font-body text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">
            Likely Intended
          </p>
          <p className="font-body text-sm text-text">
            {review.intendedMeaning}
          </p>
        </div>
      </div>

      {/* ── Issues ── */}
      {review.issues.length > 0 && (
        <div className="mb-6">
          <p className="font-body text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
            Issues Found
          </p>
          <ul className="space-y-1.5">
            {review.issues.map((issue, i) => (
              <li
                key={i}
                className="flex items-start gap-2 font-body text-sm text-text-secondary"
              >
                <span className="text-error mt-0.5 shrink-0">&#8226;</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Corrected Text ── */}
      {review.suggestion && (
        <div className="mb-6">
          <p className="font-body text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
            Corrected Text
          </p>
          <div className="bg-primary-light border border-primary/20 rounded-xl p-4">
            <p className="font-cjk text-lg text-primary">
              {review.suggestion}
            </p>
          </div>
        </div>
      )}

      {/* ── Explanation ── */}
      <div>
        <p className="font-body text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
          Explanation
        </p>
        <p className="font-body text-sm text-text-secondary leading-relaxed">
          {review.explanation}
        </p>
      </div>
    </div>
  );
}
