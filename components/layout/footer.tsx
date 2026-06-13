"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border-light py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-body text-xs text-text-muted text-center md:text-left leading-relaxed">
          {t("disclaimer")}
        </p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="font-body text-xs text-text-muted hover:text-primary transition-colors">
            {t("privacy")}
          </Link>
          <Link href="/terms" className="font-body text-xs text-text-muted hover:text-primary transition-colors">
            {t("terms")}
          </Link>
        </div>
        <p className="font-body text-xs text-text-muted whitespace-nowrap">
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
