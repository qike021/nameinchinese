"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/**
 * LoginPage — email + password authentication via Supabase Auth.
 *
 * Design: centered card layout matching the project Design System.
 * On success: redirects to admin dashboard.
 * On failure: shows error message below the form.
 */
export default function LoginPage() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params?.lang ?? "en";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!email || !password) {
        setError("Please enter both email and password.");
        return;
      }

      setIsLoading(true);

      try {
        const supabase = createClient();
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
          setIsLoading(false);
          return;
        }

        // Success — redirect to admin dashboard
        router.push(`/${lang}/admin`);
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
        setIsLoading(false);
      }
    },
    [email, password, lang, router]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-[400px]">
        {/* ── Card ── */}
        <div className="bg-surface rounded-2xl shadow-md border border-border-light p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link
              href={`/${lang}`}
              className="font-cjk text-2xl font-bold text-primary hover:opacity-90 transition-opacity"
            >
              ☯ 华名堂
            </Link>
            <p className="font-body text-sm text-text-muted mt-2">
              Admin Login
            </p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block font-body text-sm font-medium text-text-secondary mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nameinchinese.com"
                autoComplete="email"
                required
                className="w-full h-11 px-4 rounded-lg border border-border bg-surface font-body text-sm text-text
                           placeholder:text-text-muted
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block font-body text-sm font-medium text-text-secondary mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full h-11 px-4 rounded-lg border border-border bg-surface font-body text-sm text-text
                           placeholder:text-text-muted
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200">
                <p className="font-body text-sm text-error">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary text-white rounded-lg font-body text-sm font-semibold
                         hover:bg-primary-hover transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* ── Footer text ── */}
        <p className="text-center mt-6 font-body text-xs text-text-muted">
          <Link
            href={`/${lang}`}
            className="hover:text-text-secondary transition-colors"
          >
            ← Back to Homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
