/**
 * Tattoo Review Page — AI-powered Chinese tattoo text safety analysis.
 *
 * Matches the tattoo review design with title, subtitle, and review form.
 */
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ReviewForm } from "@/components/tattoo/review-form";

export default function TattooReviewPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16">
          {/* ── Page Header ── */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-text mb-3">
              Tattoo Safety Review
            </h1>
            <p className="font-body text-sm md:text-base text-text-tertiary max-w-xl mx-auto">
              Don&apos;t end up on a &ldquo;worst Chinese tattoos&rdquo; TikTok.
              Get your text reviewed before you ink.
            </p>
          </div>

          {/* ── Review Form ── */}
          <ReviewForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
