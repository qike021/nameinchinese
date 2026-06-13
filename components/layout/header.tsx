"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { locales, localeNames } from "@/lib/i18n/config";

/**
 * Header — sticky 72px top bar with logo, nav links, language switcher, and CTA.
 *
 * Design spec:
 * - Height: 72px, sticky top, bg #FFFBF5 (bg-bg), border-bottom #E7E5E4 (border-border-light)
 * - Left: Logo "☯ NameInChinese" in font-cjk, 18px, weight 700, color #991B1B (text-primary)
 * - Right: Nav links (Pricing, Tattoo Review) + Language Switcher + CTA button
 */
export function Header() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang ?? "en";

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

        {/* ── Language Switcher (hidden on small mobile) ── */}
        <div className="hidden sm:flex items-center gap-1" role="navigation" aria-label="Language switcher">
          {locales.map((locale) => (
            <Link
              key={locale}
              href={`/${locale}`}
              className={`text-[10px] md:text-xs font-medium px-1 py-0.5 rounded transition-colors ${
                locale === lang
                  ? "bg-primary-light text-primary"
                  : "text-text-muted hover:text-primary"
              }`}
              aria-current={locale === lang ? "true" : undefined}
              title={localeNames[locale]}
            >
              {locale.toUpperCase()}
            </Link>
          ))}
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
