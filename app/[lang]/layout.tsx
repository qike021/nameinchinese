import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Noto_Serif_SC } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n/config";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-cjk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "华名堂 NameInChinese — Your Chinese Name Awaits",
    template: "%s | 华名堂 NameInChinese",
  },
  description:
    "Get a Chinese name that tells your story, not just translates sounds. Rooted in 3,000 years of poetry and philosophy.",
  keywords: [
    "chinese name generator",
    "get a chinese name",
    "chinese name meaning",
    "chinese name for tattoo",
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(locales, lang)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={lang} className={`${cormorant.variable} ${montserrat.variable} ${notoSerifSC.variable}`}>
      <body className="font-body bg-bg text-text antialiased min-h-screen">
        <NextIntlClientProvider messages={messages} locale={lang}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
