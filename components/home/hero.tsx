"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export function Hero() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang ?? "en";
  const t = useTranslations("home");

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
        <div className="w-full md:w-3/5 flex flex-col items-start">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-primary-light text-primary font-body text-xs font-semibold mb-6 tracking-wide">
            {t("heroBadge")}
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] font-bold text-text leading-tight mb-6">
            {t("heroTitle")}
          </h1>
          <p className="font-body text-base md:text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
            {t("heroSubtitle")}
          </p>
          <Link href={`/${lang}/create`} className="btn btn-primary btn-lg">
            {t("heroCta")}
          </Link>
          <p className="font-body text-xs md:text-[13px] text-text-muted mt-4">
            {t("heroSubCta")}
          </p>
        </div>

        <div className="w-full md:w-2/5">
          <div className="bg-surface rounded-xl shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-orange-600" />
            <div className="p-8 md:p-10 text-center">
              <p className="font-cjk text-6xl md:text-7xl font-bold text-primary mb-4 leading-none">
                昭韵
              </p>
              <p className="font-body text-sm text-text-secondary mb-2">
                Zhāo Yùn
              </p>
              <p className="font-body text-xs text-text-tertiary leading-relaxed">
                Bright &amp; Poetic — A name that shines with cultural depth
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
