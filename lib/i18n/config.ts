/** Supported locales in priority order */
export const locales = ["en", "ja", "ko", "zh"] as const;
export type Locale = (typeof locales)[number];

/** Fallback locale when no preference can be determined */
export const defaultLocale: Locale = "en";

/** Human-readable locale names for the language switcher */
export const localeNames: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
  ko: "한국어",
  zh: "中文",
};
