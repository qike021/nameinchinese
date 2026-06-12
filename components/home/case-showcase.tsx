/**
 * CaseShowcase — 3-column grid of name transformation case cards.
 *
 * Design spec:
 * - Section title: "Names That Tell Stories" in font-heading 36px
 * - 3-column grid of case cards matching .case-card in design
 * - Each card: {English} → {Chinese} + pinyin + source quote + meaning + 5-star testimonial
 */

interface CaseCard {
  english: string;
  chinese: string;
  pinyin: string;
  quote: string;
  meaning: string;
}

const cases: CaseCard[] = [
  {
    english: "Elizabeth",
    chinese: "伊丽莎白",
    pinyin: "Yī Lì Shā Bái",
    quote:
      "A name that carries the elegance of poetry and the strength of tradition.",
    meaning: "Graceful & Pure",
  },
  {
    english: "Alexander",
    chinese: "明凯",
    pinyin: "Míng Kǎi",
    quote:
      "A warrior's name — bright, triumphant, and destined for greatness.",
    meaning: "Bright & Triumphant",
  },
  {
    english: "Sophia",
    chinese: "慧然",
    pinyin: "Huì Rán",
    quote:
      "Wisdom wrapped in serenity — a name that feels like home.",
    meaning: "Wise & Natural",
  },
];

export function CaseShowcase() {
  return (
    <section className="bg-surface-alt py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-text text-center mb-12">
          Names That Tell Stories
        </h2>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <article
              key={c.english}
              className="bg-surface rounded-xl p-6 border border-border-light shadow-md flex flex-col"
            >
              {/* Name mapping header */}
              <div className="text-center">
                <p className="font-body text-sm text-text-tertiary mb-1">
                  {c.english}
                </p>
                <p className="font-cjk text-4xl font-bold text-primary mt-1 mb-1">
                  {c.chinese}
                </p>
                <p className="font-body text-xs text-text-secondary">
                  {c.pinyin}
                </p>
              </div>

              {/* Divider */}
              <hr className="border-border-light my-4" />

              {/* Source quote */}
              <blockquote className="font-body text-sm text-text-secondary italic leading-relaxed flex-1">
                &ldquo;{c.quote}&rdquo;
              </blockquote>

              {/* Meaning + Star rating */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light">
                <span className="font-body text-xs font-medium text-text-tertiary">
                  {c.meaning}
                </span>
                <div className="flex items-center gap-0.5" aria-label="5-star rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-amber-500 text-sm">
                      &star;
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
