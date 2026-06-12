import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client — bypasses RLS, use ONLY in server-side
 * code that needs full database access (webhooks, seed scripts, admin APIs).
 * Never expose to the browser.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
