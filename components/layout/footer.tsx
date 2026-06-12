import Link from "next/link";

/**
 * Footer — centered footer with disclaimer, links, and copyright.
 *
 * Design spec:
 * - Border-top, padding, centered
 * - Disclaimer + Privacy/ToS links + Copyright
 */
export function Footer() {
  return (
    <footer className="border-t border-border-light py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Disclaimer */}
        <p className="font-body text-xs text-text-muted text-center md:text-left leading-relaxed">
          Cultural education &amp; entertainment service. Not predictive advice.
        </p>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="font-body text-xs text-text-muted hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="font-body text-xs text-text-muted hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>
        </div>

        {/* Copyright */}
        <p className="font-body text-xs text-text-muted whitespace-nowrap">
          &copy; 2026 华名堂 NameInChinese
        </p>
      </div>
    </footer>
  );
}
