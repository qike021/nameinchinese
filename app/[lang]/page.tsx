import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { CaseShowcase } from "@/components/home/case-showcase";

/**
 * HomePage — the landing page for NameInChinese.
 *
 * Composes:
 * - Header (sticky nav with logo, links, language switcher, CTA)
 * - Hero (60/40 split with badge, headline, CTA, name preview card)
 * - CaseShowcase (3-column grid of name transformation stories)
 * - Footer (disclaimer, links, copyright)
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CaseShowcase />
      </main>
      <Footer />
    </>
  );
}
