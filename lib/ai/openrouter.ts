import OpenAI from "openai";

/**
 * OpenRouter client — OpenAI-compatible SDK pointed at the OpenRouter API.
 * OpenRouter gives us access to DeepSeek V4 Flash + V3 without WeChat real-name auth.
 *
 * Rate limits: OpenRouter free tier = 50 req/day with `:free` models.
 * Paid tier (add $5 credit) = unlimited with paid models.
 */
export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": "NameInChinese",
  },
});

/** Standard chat completion wrapper with sensible defaults for naming tasks */
export async function chatCompletion(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
) {
  return openrouter.chat.completions.create({
    model: options?.model || "deepseek/deepseek-chat-v4-flash",
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2048,
    response_format: { type: "json_object" },
  });
}
