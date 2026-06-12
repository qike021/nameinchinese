import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";

/**
 * Root page — redirect to the default locale.
 * The actual homepage lives at /[lang]/page.tsx.
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
