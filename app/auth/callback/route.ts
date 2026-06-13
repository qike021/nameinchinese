/**
 * GET /auth/callback
 *
 * Supabase Auth callback — exchanges the auth code from the email link
 * for a session, then redirects to the target page.
 *
 * Required for:
 * - Email confirmation
 * - Password reset
 * - Magic link login
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/en/admin";

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — redirect to login
  return NextResponse.redirect(`${origin}/en/login`);
}
