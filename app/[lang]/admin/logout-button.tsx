"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

/**
 * Logout button for the admin sidebar.
 * Calls Supabase signOut and redirects to the login page.
 */
export function LogoutButton({ lang }: { lang: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${lang}/login`);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg font-body text-xs text-text-muted
                 hover:text-error hover:bg-red-50 transition-colors"
    >
      <LogOut className="h-3.5 w-3.5 shrink-0" />
      <span>Logout</span>
    </button>
  );
}
