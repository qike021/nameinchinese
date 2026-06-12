/**
 * Pricing Page — choose your plan.
 *
 * Simple page with title, subtitle, and PricingCards component.
 * Matches the homepage pricing section design.
 */
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PricingCards } from "@/components/pricing/pricing-cards";

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
          {/* ── Page Header ── */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-text mb-3">
              Choose Your Plan
            </h1>
            <p className="font-body text-sm md:text-base text-text-tertiary max-w-xl mx-auto">
              All plans include a 7-day money-back guarantee
            </p>
          </div>

          {/* ── Pricing Cards ── */}
          <PricingCards />
        </div>
      </main>
      <Footer />
    </>
  );
}
