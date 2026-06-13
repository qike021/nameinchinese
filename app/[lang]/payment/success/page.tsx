"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NameCard } from "@/components/name-results/name-card";
import { BaziSummary } from "@/components/name-results/bazi-summary";
import type { NameCharacter } from "@/components/name-results/name-card";

// ── Types ──

interface UnlockedName {
  chinese_name: string;
  pinyin: string;
  characters: NameCharacter[];
  fullMeaning: string;
  culturalStory: string;
  bestFor: string;
  pronunciationTip: string;
}

interface UnlockResult {
  id: string;
  names: UnlockedName[];
  bazi: {
    missing_elements: string[];
    day_master: string;
    day_master_element: string;
    five_elements: Record<string, number>;
  } | null;
  total_names: number;
}

// ── Page ──

export default function PaymentSuccessPage() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = params?.lang ?? "en";

  const [status, setStatus] = useState<"capturing" | "generating" | "done" | "error">("capturing");
  const [result, setResult] = useState<UnlockResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get("token") || searchParams.get("order_id");

  const processPayment = useCallback(async () => {
    if (!orderId) {
      setError("No order ID found. Please try again.");
      setStatus("error");
      return;
    }

    try {
      // Step 1: Capture the PayPal order
      setStatus("capturing");
      const captureRes = await fetch("/api/payment/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (!captureRes.ok) {
        const err = await captureRes.json();
        throw new Error(err.error || "Payment capture failed");
      }

      // Step 2: Get form data from sessionStorage
      const formDataRaw = sessionStorage.getItem("nameFormData");
      if (!formDataRaw) {
        throw new Error("Form data not found. Please try the naming form again.");
      }
      const formData = JSON.parse(formDataRaw);

      // Step 3: Unlock full names
      setStatus("generating");
      const unlockRes = await fetch("/api/name/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          english_name: `${formData.firstName} ${formData.lastName}`.trim(),
          gender: formData.gender,
          birth_date: formData.birthDate || undefined,
          birth_time: formData.birthTime || undefined,
          latitude: formData.latitude || undefined,
          longitude: formData.longitude || undefined,
          profession: formData.occupation || "other",
          personality: formData.personality || [],
          preferred_style: formData.nameStyle || "balanced",
          purpose: formData.namePurpose || "study",
        }),
      });

      if (!unlockRes.ok) {
        const err = await unlockRes.json();
        throw new Error(err.error || "Name generation failed");
      }

      const unlockData: UnlockResult = await unlockRes.json();
      setResult(unlockData);
      setStatus("done");

      // Save report ID to sessionStorage for the report page
      sessionStorage.setItem("reportId", unlockData.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }, [orderId]);

  useEffect(() => {
    processPayment();
  }, [processPayment]);

  // ── Loading / Capturing ──
  if (status === "capturing") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-text-secondary">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  // ── Generating Names ──
  if (status === "generating") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-text-secondary text-lg mb-2">
            Creating your Chinese names...
          </p>
          <p className="font-body text-sm text-text-muted">
            Our AI is crafting culturally meaningful names with classical Chinese poetry and Five Elements analysis.
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="font-heading text-2xl font-bold text-text mb-2">
            Something went wrong
          </h1>
          <p className="font-body text-sm text-text-tertiary mb-6">{error}</p>
          <button
            type="button"
            onClick={() => router.push(`/${lang}/create`)}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Done — Show Full Results ──
  if (!result) return null;

  const { names, bazi, total_names } = result;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">
          {/* ── Success Header ── */}
          <div className="text-center mb-10 md:mb-12">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-text mb-3">
              Your Chinese Names Are Ready!
            </h1>
            <p className="font-body text-sm md:text-base text-text-tertiary max-w-xl mx-auto">
              We&apos;ve crafted {total_names} names with full cultural provenance, poetry references, and Five Elements analysis.
            </p>
          </div>

          {/* ── All Names (Unlocked) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 md:mb-10">
            {names.map((name, index) => (
              <NameCard
                key={index}
                chineseName={name.chinese_name}
                pinyin={name.pinyin}
                characters={name.characters}
                isLocked={false}
                isBestMatch={index === 0}
                bestMatchLabel="Best Match"
                lockedOverlayLabel=""
                onUnlock={() => {}}
              />
            ))}
          </div>

          {/* ── Bazi Analysis ── */}
          {bazi && (
            <div className="mb-8 md:mb-10">
              <BaziSummary
                missingElements={bazi.missing_elements}
                hint={`Your day master is ${bazi.day_master} (${bazi.day_master_element}). The Five Elements in your chart are: ${Object.entries(bazi.five_elements).map(([k, v]) => `${k}(${v})`).join(", ")}.`}
                title="Your Five Elements Analysis"
              />
            </div>
          )}

          {/* ── View Full Report CTA ── */}
          <div className="text-center space-y-4">
            <button
              type="button"
              onClick={() => router.push(`/${lang}/report/${result.id}`)}
              className="btn btn-primary btn-lg"
            >
              View Full Report
            </button>
            <p className="font-body text-xs text-text-muted">
              Your report is saved and can be accessed anytime with this link.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
