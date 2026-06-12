import { chatCompletion } from "./openrouter";

/**
 * Model identifiers on OpenRouter.
 * V4 Flash: primary — best Chinese culture quality, lowest cost
 * V3: fallback — different deployment, rarely down simultaneously
 */
const PRIMARY_MODEL = "deepseek/deepseek-chat-v4-flash";
const FALLBACK_MODEL = "deepseek/deepseek-chat-v3";

interface RouterOptions {
  temperature?: number;
  maxTokens?: number;
  /** Max retry attempts with fallback model. Default: 1 (primary only) */
  retries?: number;
}

interface RouterResult {
  /** The parsed response from the AI */
  result: Awaited<ReturnType<typeof chatCompletion>>;
  /** Which model actually served the request */
  model: string;
  /** Which attempt number succeeded (0 = first try with primary) */
  attempt: number;
}

/**
 * Routes an AI request through primary → fallback models.
 * If the primary model fails (rate limit, server error, timeout),
 * automatically retries with the fallback model.
 *
 * @param messages - The chat messages to send
 * @param options - Router configuration
 * @returns The AI response with metadata about which model served it
 * @throws If all models (primary + fallback) fail
 */
export async function routeAIRequest(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  options?: RouterOptions
): Promise<RouterResult> {
  const maxRetries = options?.retries ?? 1;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const model = attempt === 0 ? PRIMARY_MODEL : FALLBACK_MODEL;

    try {
      const result = await chatCompletion(messages, {
        model,
        temperature: options?.temperature,
        maxTokens: options?.maxTokens,
      });

      return { result, model, attempt };
    } catch (error) {
      // Log and try fallback
      console.warn(
        `[AI Router] Model ${model} failed (attempt ${attempt}/${maxRetries}):`,
        error instanceof Error ? error.message : error
      );

      if (attempt === maxRetries) {
        throw new Error(
          `All AI models failed after ${maxRetries + 1} attempts. Last error: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }

      // Brief delay before fallback to avoid rate-limit cascades
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // TypeScript requires this, but it should be unreachable
  throw new Error("Unreachable: AI router exhausted all models");
}

/**
 * Extracts a JSON object or array from an AI response string.
 * Handles markdown code blocks and plain JSON.
 */
export function extractJson<T = unknown>(content: string): T {
  // Try to extract from markdown code block first
  const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return JSON.parse(codeBlockMatch[1].trim()) as T;
  }

  // Try to find JSON object/array directly
  const jsonMatch = content.match(/(\{[\s\S]*\})|(\[[\s\S]*\])/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]) as T;
  }

  // Fallback: try parsing the whole content
  return JSON.parse(content) as T;
}
