"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

// ── Tier Definitions ──

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

const TIERS: TierConfig[] = [
  {
    id: "basic",
    name: "Basic",
    price: "$6.99",
    originalPrice: "$9.99",
    description: "Perfect for getting started",
    isPopular: false,
    features: [
      { key: "names5", label: "5 Chinese names", included: true },
      { key: "meanings", label: "Meanings & pinyin", included: true },
      { key: "audio", label: "Pronunciation audio", included: true },
      { key: "stories", label: "Cultural stories", included: false },
      { key: "pdfReport", label: "20-page PDF report", included: false },
      { key: "fiveElements", label: "Five Elements analysis", included: false },
      { key: "calligraphy", label: "Calligraphy images", included: false },
      { key: "consultation", label: "1-on-1 video consultation", included: false },
    ],
    ctaLabel: "Get Basic",
  },
  {
    id: "pro",
    name: "Professional",
    price: "$19.99",
    originalPrice: "$29.99",
    description: "Everything you need for a complete Chinese identity",
    isPopular: true,
    features: [
      { key: "names8", label: "8 Chinese names", included: true },
      { key: "meanings", label: "Meanings & pinyin", included: true },
      { key: "audio", label: "Pronunciation audio", included: true },
      { key: "stories", label: "Cultural stories", included: true },
      { key: "pdfReport", label: "20-page PDF report", included: true },
      { key: "fiveElements", label: "Five Elements analysis", included: true },
      { key: "calligraphy", label: "Calligraphy images", included: true },
      { key: "consultation", label: "1-on-1 video consultation", included: false },
    ],
    ctaLabel: "Get Professional",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$44.99",
    originalPrice: "$59.99",
    description: "The ultimate package with personal consultation",
    isPopular: false,
    features: [
      { key: "names8", label: "8 Chinese names", included: true },
      { key: "meanings", label: "Meanings & pinyin", included: true },
      { key: "audio", label: "Pronunciation audio", included: true },
      { key: "stories", label: "Cultural stories", included: true },
      { key: "pdfReport", label: "20-page PDF report", included: true },
      { key: "fiveElements", label: "Five Elements analysis", included: true },
      { key: "calligraphy", label: "Calligraphy images", included: true },
      { key: "consultation", label: "1-on-1 video consultation", included: true },
    ],
    ctaLabel: "Get Premium",
  },
];

// ── Component ──

/**
 * PricingCards — three-column pricing section.
 *
 * Design spec (matching homepage pricing section):
 * - 3-column grid (stacked on mobile)
 * - Most Popular badge on the Pro card (center)
 * - Price with strikethrough original
 * - Feature list with checkmarks/crosses
 * - "Get X" CTA button that creates a PayPal order and redirects
 */
export function PricingCards() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang ?? "en";
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSelectTier = async (tierId: string) => {
    setLoadingTier(tierId);

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("[Pricing] Payment creation failed:", error);
        setLoadingTier(null);
        return;
      }

      const data = await res.json();

      if (data.approveUrl) {
        // Redirect to PayPal for payment approval
        window.location.href = data.approveUrl;
      } else {
        console.error("[Pricing] No approval URL returned");
        setLoadingTier(null);
      }
    } catch (error) {
      console.error("[Pricing] Failed to create payment:", error);
      setLoadingTier(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
      {TIERS.map((tier, index) => (
        <div
          key={tier.id}
          className={cn(
            "relative flex flex-col bg-surface rounded-xl border shadow-sm overflow-hidden",
            tier.isPopular
              ? "border-primary ring-2 ring-primary/10 scale-[1.02] md:scale-105"
              : "border-border-light"
          )}
        >
          {/* ── Most Popular Badge ── */}
          {tier.isPopular && (
            <div className="absolute top-0 left-0 right-0 bg-primary text-white text-xs font-semibold text-center py-1.5 tracking-wide">
              Most Popular
            </div>
          )}

          {/* ── Card Header ── */}
          <div className={cn(
            "px-6 pt-8 pb-6 text-center border-b border-border-light",
            tier.isPopular && "pt-10"
          )}>
            {/* Tier Name */}
            <h3 className={cn(
              "font-heading text-xl font-semibold mb-2",
              tier.isPopular ? "text-primary" : "text-text"
            )}>
              {tier.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-text-tertiary mb-4">
              {tier.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-4xl font-bold text-text">
                {tier.price}
              </span>
              <span className="text-sm text-text-muted line-through">
                {tier.originalPrice}
              </span>
            </div>
          </div>

          {/* ── Feature List ── */}
          <div className="flex-1 px-6 py-6 space-y-3">
            {tier.features.map((feature) => (
              <div key={feature.key} className="flex items-center gap-3">
                {feature.included ? (
                  <svg
                    className="w-5 h-5 text-success shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-text-muted shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span
                  className={cn(
                    "text-sm",
                    feature.included ? "text-text" : "text-text-muted"
                  )}
                >
                  {feature.label}
                </span>
              </div>
            ))}
          </div>

          {/* ── CTA Button ── */}
          <div className="px-6 pb-6">
            <button
              type="button"
              onClick={() => handleSelectTier(tier.id)}
              disabled={loadingTier === tier.id}
              className={cn(
                "btn btn-block",
                tier.isPopular ? "btn-primary" : "btn-outline"
              )}
            >
              {loadingTier === tier.id ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                tier.ctaLabel
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
