import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`@/lib/i18n/dictionaries/${locale}`)).default,
  };
});
