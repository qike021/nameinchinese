/**
 * English Name Etymology Analyzer
 *
 * Uses AI to break down an English name into its linguistic origin
 * and cultural concepts. These concepts become the bridge between
 * the English meaning and Chinese cultural mapping.
 */

import { routeAIRequest, extractJson } from "@/lib/ai/router";
import { ETYMOLOGY_PROMPT } from "@/lib/ai/prompts";

/** Parsed etymology result from the AI */
export interface EtymologyResult {
  /** Linguistic origin of the name, e.g. "Latin 'Aemilia'" */
  origin: string;
  /** The original meaning in the source language, e.g. "rival, striving" */
  originalMeaning: string;
  /** Abstract cultural concepts, e.g. ["excellence", "diligence"] */
  culturalConcepts: string[];
  /** Personality traits associated with the name, e.g. ["competitive"] */
  personalityTraits: string[];
}

/**
 * Analyze the etymology and cultural meaning of an English name.
 * This is the first step of the naming pipeline.
 *
 * @param englishName - The user's English given name
 * @returns Parsed etymology with origin, meaning, concepts, and traits
 */
export async function analyzeEtymology(
  englishName: string
): Promise<EtymologyResult> {
  const prompt = ETYMOLOGY_PROMPT.replace("{englishName}", englishName);

  const { result } = await routeAIRequest([
    { role: "system", content: prompt },
    { role: "user", content: englishName },
  ]);

  const content = result.choices[0]?.message?.content || "{}";
  return extractJson<EtymologyResult>(content);
}
