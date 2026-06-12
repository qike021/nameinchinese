"use client";

import { useState } from "react";
import { ReviewResult } from "./review-result";

interface ReviewData {
  status: "safe" | "warning" | "danger";
  actualMeaning: string;
  intendedMeaning: string;
  issues: string[];
  suggestion: string;
  explanation: string;
}

export function ReviewForm() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/tattoo/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to review text");
      }

      setResult(data.review);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Input Card ── */}
      <div className="bg-surface rounded-2xl shadow-md p-6 md:p-8 mb-6 border border-border-light">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="tattoo-text"
              className="block font-body text-sm font-semibold text-text mb-2"
            >
              Enter the Chinese text for your tattoo
            </label>
            <textarea
              id="tattoo-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. 爱、力量、和平"
              maxLength={200}
              rows={4}
              className="w-full px-4 py-3 bg-bg border border-border rounded-xl font-body text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              disabled={loading}
            />
            <p className="text-xs text-text-muted mt-1.5 text-right">
              {text.length}/200
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="btn-block disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Reviewing...
              </span>
            ) : (
              "Review My Tattoo"
            )}
          </button>
        </form>
      </div>

      {/* ── Error Message ── */}
      {error && (
        <div className="bg-error/10 border border-error/30 rounded-2xl p-4 mb-6">
          <p className="font-body text-sm text-error">{error}</p>
        </div>
      )}

      {/* ── Review Result ── */}
      {result && <ReviewResult review={result} />}

      {/* ── Disclaimer ── */}
      <p className="font-body text-xs text-text-muted text-center mt-6 leading-relaxed">
        This is a cultural reference review. Tattoo decisions are the sole
        responsibility of the user.
      </p>
    </div>
  );
}
