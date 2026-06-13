"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { locales, localeNames, defaultLocale } from "@/lib/i18n/config";

/**
 * Header — sticky 72px top bar with logo, nav links, language switcher, and CTA.
 *
 * Desktop: full nav + language pills + CTA
 * Mobile: compact language select + CTA, nav hidden
 */
export function Header() {
  const params = useParams<{ lang: string }>();
  const pathname = usePathname();
  const lang = params?.lang ?? "en";
  const [langOpen, setLangOpen] = useState(false);

  /** Replace the locale segment in the current pathname */
  function switchLocaleHref(targetLocale: string): string {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && (locales as readonly string[]).includes(segments[0])) {
      segments[0] = targetLocale;
    }
    return "/" + segments.join("/");
  }

  return (
    <header className="h-[72px] flex items-center justify-between px-4 md:px-10 bg-bg sticky top-0 z-50 border-b border-border-light">
      {/* ── Logo ── */}
      <Link
        href={`/${lang}`}
        className="font-cjk text-base md:text-lg font-bold text-primary hover:opacity-90 transition-opacity shrink-0"
      >
        ☯ NameInChinese
      </Link>

      {/* ── Right Section ── */}
      <div className="flex items-center gap-2 md:gap-6">
        {/* Nav Links (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href={`/${lang}/pricing`}
            className="font-body text-sm font-medium text-text-secondary hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            href={`/${lang}/tattoo`}
            className="font-body text-sm font-medium text-text-secondary hover:text-primary transition-colors"
          >
            Tattoo Review
          </Link>
          <Link
            href={`/${lang}/about`}
            className="font-body text-sm font-medium text-text-secondary hover:text-primary transition-colors"
          >
            About
          </Link>
        </nav>

        {/* ── Language Switcher ── */}
        {/* Desktop: full pill row */}
        <div className="hidden md:flex items-center gap-1">
          {locales.map((locale) => (
            <Link
              key={locale}
              href={switchLocaleHref(locale)}
              className={`text-xs font-medium px-1.5 py-0.5 rounded transition-colors ${
                locale === lang
                  ? "bg-primary-light text-primary"
                  : "text-text-muted hover:text-primary"
              }`}
            >
              {locale.toUpperCase()}
            </Link>
          ))}
        </div>

        {/* Mobile: compact language select */}
        <div className="relative md:hidden">
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-0.5 text-xs font-semibold text-text-secondary px-2 py-1 rounded border border-border hover:border-primary transition-colors"
          >
            {lang.toUpperCase()}
            <svg className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {langOpen && (
            <div className="absolute top-full right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg py-1 z-50 min-w-[80px]">
              {locales.map((locale) => (
                <Link
                  key={locale}
                  href={switchLocaleHref(locale)}
                  onClick={() => setLangOpen(false)}
                  className={`block px-3 py-1.5 text-xs font-medium transition-colors ${
                    locale === lang
                      ? "bg-primary-light text-primary"
                      : "text-text-secondary hover:bg-surface-alt"
                  }`}
                >
                  {localeNames[locale]}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── CTA Button ── */}
        <Link
          href={`/${lang}/create`}
          className="btn btn-primary btn-sm shrink-0"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
