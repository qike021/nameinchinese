import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/** 核心价值观 */
const VALUES = [
  {
    icon: "📚",
    title: "Cultural Accuracy",
    description:
      "Every character is verified against classical sources and living cultural context. We never compromise on authenticity.",
  },
  {
    icon: "🔍",
    title: "Transparency",
    description:
      "You see exactly why each character was chosen, with traceable citations to the original classical texts.",
  },
  {
    icon: "🤝",
    title: "Respect",
    description:
      "We approach Chinese culture as students, never appropriators. Every recommendation is made with deep reverence.",
  },
];

/**
 * AboutPage — brand story + values + team.
 * Matches desktop/about.html design spec exactly.
 */
export default function AboutPage() {
  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section className="bg-surface-dark py-20 md:py-24 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-[44px] font-bold text-bg max-w-[700px] mx-auto mb-5 leading-tight">
          Bridging Two Worlds, One Name at a Time
        </h1>
        <p className="font-body text-base text-text-muted max-w-[600px] mx-auto leading-relaxed">
          We believe a name is not just a label — it is a vessel of identity,
          culture, and meaning. Our mission is to help non-Chinese speakers
          discover names that honor both their heritage and their new cultural
          journey.
        </p>
      </section>

      {/* ── Our Story ── */}
      <section className="bg-bg py-16 md:py-20 px-4 text-center">
        <h2 className="font-heading text-[32px] font-bold text-text mb-8">
          Our Story
        </h2>
        <div className="max-w-[700px] mx-auto space-y-5 text-left">
          <p className="font-body text-[15px] text-text-secondary leading-relaxed">
            NameInChinese was born from a simple observation: thousands of
            people were getting Chinese characters tattooed, printed, and
            adopted as names — often without understanding their full cultural
            weight. We saw well-meaning people walking around with characters
            that meant something entirely different from what they intended.
          </p>
          <p className="font-body text-[15px] text-text-secondary leading-relaxed">
            We asked: what if we could do better? What if there was a way to
            bridge the gap between a person&apos;s identity and a culture&apos;s
            depth — not through superficial translation, but through genuine
            understanding of character etymology, classical references, and the
            living traditions that give Chinese names their power?
          </p>
          <p className="font-body text-[15px] text-text-secondary leading-relaxed">
            Today, our Cultural Mapping Engine combines computational
            linguistics with 50,000+ classical texts to generate names that are
            not merely translated — they are composed. Every character is traced
            to its earliest appearances in poetry, philosophy, and historical
            records, ensuring that your Chinese name carries the same
            intentionality and care you&apos;d give any important choice.
          </p>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-bg pb-16 md:pb-20 px-4">
        <h2 className="font-heading text-[32px] font-bold text-text text-center mb-10">
          What We Stand For
        </h2>
        <div className="flex flex-col md:flex-row gap-6 max-w-[1280px] mx-auto">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="flex-1 bg-surface rounded-2xl p-8 shadow-sm"
            >
              <div className="text-[32px] mb-4">{v.icon}</div>
              <h3 className="font-heading text-xl font-semibold text-text mb-2.5">
                {v.title}
              </h3>
              <p className="font-body text-sm text-text-tertiary leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-bg pb-16 md:pb-20 px-4 text-center">
        <h2 className="font-heading text-[32px] font-bold text-text mb-5">
          Built by a Global Team
        </h2>
        <p className="font-body text-[15px] text-text-secondary max-w-[700px] mx-auto leading-relaxed">
          Our team spans Beijing, London, Tokyo, and San Francisco — linguists,
          classical literature scholars, and software engineers united by a
          shared belief that technology can deepen cultural understanding, not
          dilute it.
        </p>
      </section>

      <Footer />
    </>
  );
}
