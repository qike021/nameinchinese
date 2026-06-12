import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

/** Serif heading — English titles and large display text */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

/** Sans-serif body — paragraphs, buttons, form elements */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/** Serif CJK — Chinese characters and calligraphic display */
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} ${notoSerifSC.variable}`}
    >
      <body className="font-body bg-bg text-text antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
