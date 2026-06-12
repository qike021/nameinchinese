/**
 * Root layout.
 * The actual HTML structure, fonts, and locale provider are in app/[lang]/layout.tsx.
 * This file exists only because Next.js requires a root layout file.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
