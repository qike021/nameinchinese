import Link from "next/link";

/**
 * Hero — full-width section with 60/40 split layout.
 *
 * Design spec:
 * - Left (60%): Badge pill, H1 (Cormorant 56px bold), subtitle, CTA, sub-CTA
 * - Right (40%): Name Preview Card with gradient top bar, Chinese chars 72px, pinyin, meaning
 */
export function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
        {/* ── Left Column (60%) ── */}
        <div className="w-full md:w-3/5 flex flex-col items-start">
          {/* Badge pill */}
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-primary-light text-primary font-body text-xs font-semibold mb-6 tracking-wide">
            AI-Powered Cultural Naming
          </div>

          {/* H1 */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] font-bold text-text leading-tight mb-6">
            Your Chinese Name Should Tell a Story
          </h1>

          {/* Subtitle */}
          <p className="font-body text-base md:text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
            Not just a translation. A name rooted in 3,000 years of poetry and philosophy.
          </p>

          {/* CTA button */}
          <Link
            href="/create"
            className="btn btn-primary btn-lg"
          >
            Get My Chinese Name &rarr;
          </Link>

          {/* Sub-CTA */}
          <p className="font-body text-xs md:text-[13px] text-text-muted mt-4">
            Free names &middot; 4.9&star; rating &middot; 7-day refund
          </p>
        </div>

        {/* ── Right Column (40%) — Name Preview Card ── */}
        <div className="w-full md:w-2/5">
          <div className="bg-surface rounded-xl shadow-lg overflow-hidden">
            {/* Top gradient bar */}
            <div className="h-2 bg-gradient-to-r from-primary to-orange-600" />

            {/* Card content */}
            <div className="p-8 md:p-10 text-center">
              <p className="font-cjk text-6xl md:text-7xl font-bold text-primary mb-4 leading-none">
                昭韵
              </p>
              <p className="font-body text-sm text-text-secondary mb-2">
                Zhāo Y&ugrave;n
              </p>
              <p className="font-body text-xs text-text-tertiary leading-relaxed">
                Bright &amp; Poetic &mdash; A name that shines with cultural depth
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
