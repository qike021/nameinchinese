/**
 * Candidate Character Matcher
 *
 * Takes Bazi results + user context and produces prioritized
 * character recommendations for the naming engine.
 *
 * Strategy:
 * 1. Find missing elements → recommend characters to fill gaps
 * 2. Find the day master's element → recommend characters to strengthen
 * 3. Generate a human-readable recommendation summary
 */

import type { BaziResult } from "./client";
import {
  getMissingElements,
  getStrongestElement,
  getCharsForElement,
} from "./five-elements";

/** Context needed for candidate matching */
export interface MatchContext {
  bazi: BaziResult;
  culturalConcepts: string[];
  gender: "male" | "female";
  preferredStyle: "traditional" | "balanced" | "modern";
}

/** A candidate character with its selection rationale */
export interface CandidateChar {
  /** The Chinese character */
  char: string;
  /** Which Five Element this character belongs to */
  element: string;
  /** Why this character was selected (explanation for the naming engine) */
  reason: string;
}

/** Complete matching result — two pools of candidates */
export interface MatchResult {
  /** Characters that fill missing elements (highest priority) */
  missing: CandidateChar[];
  /** Characters that strengthen the day master (secondary priority) */
  strengthen: CandidateChar[];
  /** Human-readable recommendation for the naming engine prompt */
  recommendation: string;
}

/**
 * Match candidate characters to balance the user's Bazi chart.
 *
 * The matching strategy:
 * - MISSING elements get highest priority — the chart is imbalanced without them
 * - Day master STRENGTHENING is secondary — supports the core personality
 * - The recommendation string summarizes the strategy for the AI naming prompt
 *
 * @param context - User's Bazi result + profile context
 * @returns Prioritized character candidates and recommendation
 */
export function matchCandidates(context: MatchContext): MatchResult {
  const { bazi } = context;

  // Find what's missing
  const missingElements = getMissingElements(bazi.five_elements);
  const strongestElement = getStrongestElement(bazi.five_elements);

  // Build missing-element candidates (top priority)
  const missingCandidates: CandidateChar[] = missingElements.flatMap(
    (element) =>
      getCharsForElement(element, 4).map((char) => ({
        char,
        element,
        reason: `Your chart lacks ${element} element. "${char}" (${element}) brings this energy to balance your name.`,
      }))
  );

  // Build day-master-strengthening candidates (secondary priority)
  const strengthenCandidates: CandidateChar[] = getCharsForElement(
    strongestElement,
    2
  ).map((char) => ({
    char,
    element: strongestElement,
    reason: `Your day master needs ${strongestElement} support. "${char}" (${strongestElement}) strengthens your core energy.`,
  }));

  // Generate the human-readable recommendation
  let recommendation: string;

  if (missingElements.length > 0) {
    recommendation = `This chart is missing ${missingElements.join(" and ")}. Prioritize characters with ${missingElements.join(" or ")} elements to achieve five-element harmony.`;
  } else {
    recommendation = `The five elements are balanced. Choose characters primarily for meaning and cultural resonance rather than elemental correction.`;
  }

  return {
    missing: missingCandidates,
    strengthen: strengthenCandidates,
    recommendation,
  };
}
