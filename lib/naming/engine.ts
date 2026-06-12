/**
 * Cultural Naming Engine — Core Orchestrator
 *
 * This is the main pipeline that powers NameInChinese:
 *
 *   English Name → Etymology Analysis → Bazi Calculation (optional)
 *   → Candidate Character Matching → AI Name Generation
 *   → 5 Names with Full Cultural Provenance
 *
 * Each step builds context for the next. The AI is the final "composer"
 * but all the knowledge retrieval (etymology, Bazi, poetry) happens
 * before the AI is called, so the AI prompt is rich with structured data.
 */

import { routeAIRequest, extractJson } from "@/lib/ai/router";
import { NAMING_PROMPT } from "@/lib/ai/prompts";
import { analyzeEtymology } from "./etymology";
import {
  calculateBazi,
  type BaziRequest,
  type BaziResult,
} from "@/lib/bazi/client";
import { matchCandidates } from "@/lib/bazi/name-matcher";

// ── Types ─────────────────────────────────────────

/** Input parameters for name generation */
export interface NameRequest {
  englishName: string;
  gender: "male" | "female";
  birthDate?: string;
  birthTime?: string;
  latitude?: number;
  longitude?: number;
  profession: string;
  personality: string[];
  preferredStyle: "traditional" | "balanced" | "modern";
  purpose: string;
}

/** A single generated Chinese name with full cultural provenance */
export interface GeneratedName {
  chinese_name: string;
  pinyin: string;
  characters: {
    char: string;
    meaning: string;
    element: string;
    source: string;
  }[];
  fullMeaning: string;
  culturalStory: string;
  bestFor: string;
  pronunciationTip: string;
}

/** Complete naming result */
export interface NamingResult {
  names: GeneratedName[];
  baziResult: BaziResult | null;
}

// ── Pipeline ──────────────────────────────────────

/**
 * Generate Chinese names for a user.
 *
 * Pipeline:
 * 1. Etymology — analyze the English name's origin and meaning
 * 2. Bazi (optional) — calculate the user's birth chart
 * 3. Candidate matching — recommend characters to balance elements
 * 4. AI generation — compose names with DeepSeek V4 Flash
 *
 * @param request - The user's profile and preferences
 * @param count - How many names to generate (default: 5)
 * @returns The generated names and optional Bazi result
 */
export async function generateNames(
  request: NameRequest,
  count: number = 5
): Promise<NamingResult> {
  // ── Step 1: Etymology Analysis ──
  const etymology = await analyzeEtymology(request.englishName);

  // ── Step 2: Bazi Calculation (optional — requires birth info) ──
  let baziResult: BaziResult | null = null;
  let baziProfile = "Not provided — use meaning and culture only.";

  if (
    request.birthDate &&
    request.birthTime &&
    request.latitude !== undefined &&
    request.longitude !== undefined
  ) {
    try {
      baziResult = await calculateBazi({
        birth_date: request.birthDate,
        birth_time: request.birthTime,
        latitude: request.latitude,
        longitude: request.longitude,
      });

      const candidates = matchCandidates({
        bazi: baziResult,
        culturalConcepts: etymology.culturalConcepts,
        gender: request.gender,
        preferredStyle: request.preferredStyle,
      });

      // Build a structured Bazi profile string for the AI prompt
      baziProfile = [
        `Day Master: ${baziResult.day_master} (${baziResult.day_master_element})`,
        `Five Elements: ${JSON.stringify(baziResult.five_elements)}`,
        `Missing Elements: ${baziResult.missing_elements.join(", ") || "none"}`,
        `Recommended Characters (missing): ${candidates.missing.map((c) => `${c.char}(${c.element})`).join(", ") || "none"}`,
        `Recommended Characters (strengthen): ${candidates.strengthen.map((c) => `${c.char}(${c.element})`).join(", ") || "none"}`,
        `Strategy: ${candidates.recommendation}`,
      ].join("\n");
    } catch (error) {
      console.warn(
        "[Naming Engine] Bazi calculation failed, continuing without it:",
        error
      );
      // Continue without Bazi — the engine degrades gracefully
    }
  }

  // ── Step 3: AI Name Generation ──
  const prompt = NAMING_PROMPT
    .replace("{englishName}", request.englishName)
    .replace("{originMeaning}", etymology.originalMeaning)
    .replace("{culturalConcepts}", etymology.culturalConcepts.join(", "))
    .replace("{gender}", request.gender)
    .replace("{profession}", request.profession)
    .replace("{personality}", request.personality.join(", "))
    .replace("{preferredStyle}", request.preferredStyle)
    .replace("{purpose}", request.purpose)
    .replace("{baziProfile}", baziProfile)
    .replace("{count}", String(count));

  const { result } = await routeAIRequest([
    { role: "system", content: prompt },
    {
      role: "user",
      content: `Generate ${count} Chinese names for ${request.englishName}.`,
    },
  ]);

  const content = result.choices[0]?.message?.content || "[]";
  const names = extractJson<GeneratedName[]>(content);

  return { names: Array.isArray(names) ? names : [], baziResult };
}
