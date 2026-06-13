"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface TierFeature {
  key: string;
  label: string;
  included: boolean;
}

interface TierConfig {
  id: "basic" | "pro" | "premium";
  name: string;
  price: string;
  originalPrice: string;
  description: string;
  isPopular: boolean;
  features: TierFeature[];
  ctaLabel: string;
}

export function PricingCards() {
  const t = useTranslations("pricing");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const TIERS: TierConfig[] = [
    {
      id: "basic",
      name: t("basic.name"),
      price: t("basic.price"),
      originalPrice: t("basic.originalPrice"),
      description: t("basic.desc"),
      isPopular: false,
      features: [
        { key: "names5", label: t("features.names5"), included: true },
        { key: "meanings", label: t("features.meanings"), included: true },
        { key: "audio", label: t("features.audio"), included: true },
        { key: "stories", label: t("features.stories"), included: false },
        { key: "pdfReport", label: t("features.pdfReport"), included: false },
        { key: "fiveElements", label: t("features.fiveElements"), included: false },
        { key: "calligraphy", label: t("features.calligraphy"), included: false },
        { key: "consultation", label: t("features.consultation"), included: false },
      ],
      ctaLabel: "Get Basic",
    },
    {
      id: "pro",
      name: t("pro.name"),
      price: t("pro.price"),
      originalPrice: t("pro.originalPrice"),
      description: t("pro.desc"),
      isPopular: true,
      features: [
        { key: "names8", label: t("features.names8"), included: true },
        { key: "meanings", label: t("features.meanings"), included: true },
        { key: "audio", label: t("features.audio"), included: true },
        { key: "stories", label: t("features.stories"), included: true },
        { key: "pdfReport", label: t("features.pdfReport"), included: true },
        { key: "fiveElements", label: t("features.fiveElements"), included: true },
        { key: "calligraphy", label: t("features.calligraphy"), included: true },
        { key: "consultation", label: t("features.consultation"), included: false },
      ],
      ctaLabel: "Get Professional",
    },
    {
      id: "premium",
      name: t("premium.name"),
      price: t("premium.price"),
      originalPrice: t("premium.originalPrice"),
      description: t("premium.desc"),
      isPopular: false,
      features: [
        { key: "names8", label: t("features.names8"), included: true },
        { key: "meanings", label: t("features.meanings"), included: true },
        { key: "audio", label: t("features.audio"), included: true },
        { key: "stories", label: t("features.stories"), included: true },
        { key: "pdfReport", label: t("features.pdfReport"), included: true },
        { key: "fiveElements", label: t("features.fiveElements"), included: true },
        { key: "calligraphy", label: t("features.calligraphy"), included: true },
        { key: "consultation", label: t("features.consultation"), included: true },
      ],
      ctaLabel: "Get Premium",
    },
  ];

  const handleSelectTier = async (tierId: string) => {
    setLoadingTier(tierId);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId }),
      });
      if (!res.ok) throw new Error("Payment creation failed");
      const data = await res.json();
      if (data.approveUrl) {
        window.location.href = data.approveUrl;
      }
    } catch (error) {
      console.error("[Pricing] Failed:", error);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
      {TIERS.map((tier) => (
        <div
          key={tier.id}
          className={cn(
            "relative flex flex-col bg-surface rounded-xl border shadow-sm overflow-hidden",
            tier.isPopular
              ? "border-primary ring-2 ring-primary/10 scale-[1.02] md:scale-105"
              : "border-border-light"
          )}
        >
          {tier.isPopular && (
            <div className="absolute top-0 left-0 right-0 bg-primary text-white text-xs font-semibold text-center py-1.5 tracking-wide">
              {t("mostPopular")}
            </div>
          )}
          <div className={cn("px-6 pt-8 pb-6 text-center border-b border-border-light", tier.isPopular && "pt-10")}>
            <h3 className={cn("font-heading text-xl font-semibold mb-2", tier.isPopular ? "text-primary" : "text-text")}>
              {tier.name}
            </h3>
            <p className="text-sm text-text-tertiary mb-4">{tier.description}</p>
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-4xl font-bold text-text">{tier.price}</span>
              <span className="text-sm text-text-muted line-through">{tier.originalPrice}</span>
            </div>
          </div>
          <div className="flex-1 px-6 py-6 space-y-3">
            {tier.features.map((feature) => (
              <div key={feature.key} className="flex items-center gap-3">
                {feature.included ? (
                  <svg className="w-5 h-5 text-success shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center text-text-muted shrink-0">—</span>
                )}
                <span className={cn("text-sm", feature.included ? "text-text" : "text-text-muted")}>
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6">
            <button
              type="button"
              onClick={() => handleSelectTier(tier.id)}
              disabled={loadingTier === tier.id}
              className={cn("btn btn-block", tier.isPopular ? "btn-primary" : "btn-outline")}
            >
              {loadingTier === tier.id ? "Processing..." : tier.ctaLabel}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
