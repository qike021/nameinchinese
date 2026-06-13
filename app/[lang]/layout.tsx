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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://nameinchinese.vercel.app"
  ),
  title: {
    default: "NameInChinese — Your Chinese Name, Culturally Rooted",
    template: "%s | NameInChinese",
  },
  description:
    "Get a Chinese name backed by classical poetry, Five Elements analysis, and 3,000 years of cultural tradition. AI-powered, scholar-reviewed. Free preview, from $6.99.",
  keywords: [
    "chinese name generator",
    "get a chinese name",
    "chinese name meaning",
    "chinese name for tattoo",
    "bazi name",
    "five elements name",
    "chinese name feng shui",
    "chinese cultural name",
  ],
  openGraph: {
    title: "NameInChinese — Your Chinese Name, Culturally Rooted",
    description:
      "Get a Chinese name backed by classical poetry, Five Elements analysis, and 3,000 years of cultural tradition.",
    url: "/",
    siteName: "NameInChinese",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NameInChinese — Cultural Naming",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NameInChinese — Your Chinese Name, Culturally Rooted",
    description:
      "Get a Chinese name backed by classical poetry, Five Elements analysis, and 3,000 years of cultural tradition.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
