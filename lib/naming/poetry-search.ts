/**
 * Classical Poetry Search (RAG Retrieval)
 *
 * Searches the poetry database for verses containing specific characters
 * or matching cultural themes. Used to add authentic classical citations
 * to generated names.
 *
 * In Phase 1, this falls back gracefully when the database is empty.
 * Phase 3 adds the full poetry corpus via seed data.
 */

import { createServerSupabase } from "@/lib/supabase/server";

/** A poetry record from the database */
export interface PoetryResult {
  id: string;
  dynasty: string;
  author: string;
  work: string;
  quote: string;
  characters: string[];
  themes: string[];
}

/**
 * Search for poetry containing a specific Chinese character.
 *
 * @param char - A single Chinese character to search for
 * @param limit - Maximum number of results (default: 5)
 * @returns Matching poetry records, or empty array if database is empty
 */
export async function searchPoetryByChar(
  char: string,
  limit: number = 5
): Promise<PoetryResult[]> {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("poetry")
      .select("*")
      .contains("characters", [char])
      .limit(limit);

    return (data || []) as PoetryResult[];
  } catch {
    // Database not seeded yet — return empty gracefully
    return [];
  }
}

/**
 * Search for poetry matching a cultural theme.
 *
 * @param theme - A theme keyword, e.g. "光明" (brightness), "自然" (nature)
 * @param limit - Maximum number of results (default: 5)
 * @returns Matching poetry records, or empty array if database is empty
 */
export async function searchPoetryByTheme(
  theme: string,
  limit: number = 5
): Promise<PoetryResult[]> {
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("poetry")
      .select("*")
      .contains("themes", [theme])
      .limit(limit);

    return (data || []) as PoetryResult[];
  } catch {
    return [];
  }
}
