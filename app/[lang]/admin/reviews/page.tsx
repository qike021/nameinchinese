"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageSquare, RefreshCw, Shield, AlertTriangle, CheckCircle } from "lucide-react";

// ── Types ──

interface Review {
  id: string;
  requested_text: string;
  status: string;
  created_at: string;
  review_result?: {
    status?: "safe" | "warning" | "danger";
    actualMeaning?: string;
    intendedMeaning?: string;
    issues?: string[];
    suggestion?: string;
    explanation?: string;
  };
}

// ── Helpers ──

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function reviewStatusIcon(status?: string) {
  switch (status) {
    case "safe": return { icon: CheckCircle, cls: "text-success", label: "Safe" };
    case "warning": return { icon: AlertTriangle, cls: "text-warning", label: "Warning" };
    case "danger": return { icon: Shield, cls: "text-error", label: "Danger" };
    default: return { icon: MessageSquare, cls: "text-text-muted", label: "Pending" };
  }
}

// ── Page ──

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) throw new Error("Failed to load reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-text">
            Tattoo Reviews
          </h1>
          <p className="font-body text-sm text-text-tertiary mt-1">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={fetchReviews}
          disabled={loading}
          className="flex items-center gap-2 h-9 px-4 border border-border rounded-lg text-sm font-medium
                     text-text-secondary hover:border-primary hover:text-primary transition-colors
                     disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-error/10 border border-error/30 rounded-xl p-4 mb-6">
          <p className="font-body text-sm text-error">{error}</p>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2 text-text-muted">
            <RefreshCw className="animate-spin h-5 w-5" />
            <span className="font-body text-sm">Loading reviews...</span>
          </div>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && reviews.length === 0 && (
        <div className="bg-surface rounded-2xl shadow-sm border border-border-light px-6 py-16 text-center">
          <Shield className="h-10 w-10 text-text-muted mx-auto mb-3" />
          <p className="font-body text-text-secondary font-medium mb-1">No tattoo reviews yet</p>
          <p className="font-body text-sm text-text-muted">
            Tattoo safety reviews will appear here after users submit text for review.
          </p>
        </div>
      )}

      {/* ── Reviews List ── */}
      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => {
            const result = review.review_result;
            const { icon: StatusIcon, cls: statusCls, label: statusLabel } = reviewStatusIcon(result?.status);

            return (
              <div
                key={review.id}
                className="bg-surface rounded-xl shadow-sm border border-border-light overflow-hidden"
              >
                <div className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Requested text */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-cjk text-2xl">{review.requested_text}</span>
                      <span className={`flex items-center gap-1 text-xs font-semibold ${statusCls}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusLabel}
                      </span>
                    </div>

                    {/* Review details */}
                    {result && (
                      <div className="space-y-1.5 mt-3 pl-4 border-l-2 border-border-light">
                        {result.actualMeaning && (
                          <p className="text-sm">
                            <span className="text-text-muted">Meaning: </span>
                            <span className="text-text">{result.actualMeaning}</span>
                          </p>
                        )}
                        {result.explanation && (
                          <p className="text-sm text-text-tertiary">{result.explanation}</p>
                        )}
                        {result.issues && result.issues.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.issues.map((issue, i) => (
                              <span key={i} className="inline-flex px-2 py-0.5 rounded bg-error/10 text-error text-xs">
                                {issue}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <span className="shrink-0 text-xs text-text-muted mt-1">
                    {formatDate(review.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
