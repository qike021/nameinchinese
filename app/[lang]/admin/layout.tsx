/**
 * Admin Layout — sidebar navigation with Dashboard, Orders, Reviews links.
 *
 * Protected: redirects to /login if no valid user session.
 * Sidebar: fixed left panel with logo, nav links, and user info.
 * Content: right panel with padding.
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  LayoutDashboard,
  ShoppingCart,
  MessageSquare,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // ── Auth check ──
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${lang}/login`);
  }

  return (
    <div className="flex min-h-screen bg-bg">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-surface border-r border-border-light shrink-0 hidden md:flex flex-col">
        {/* Logo */}
        <div className="h-[72px] flex items-center px-6 border-b border-border-light">
          <Link
            href={`/${lang}`}
            className="font-cjk text-lg font-bold text-primary hover:opacity-90 transition-opacity"
          >
            ☯ NameInChinese
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/admin"; // simplified: could be enhanced with usePathname

            return (
              <Link
                key={item.href}
                href={`/${lang}${item.href}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-text-secondary hover:bg-surface-alt hover:text-text"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="px-3 py-4 border-t border-border-light">
          <div className="px-3 py-2">
            <p className="font-body text-xs text-text-muted truncate">
              {user.email ?? "Admin User"}
            </p>
          </div>
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-[56px] bg-surface border-b border-border-light flex items-center px-4 z-50">
        <Link
          href={`/${lang}`}
          className="font-cjk text-base font-bold text-primary"
        >
          ☯ NameInChinese
        </Link>
        <div className="ml-auto">
          <span className="font-body text-xs text-text-muted">Admin</span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 bg-bg md:pt-0 pt-[56px]">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
