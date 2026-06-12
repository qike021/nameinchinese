import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/lib/i18n/config";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  // Match all pathnames except /api, /_next, /_vercel, and static files
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
