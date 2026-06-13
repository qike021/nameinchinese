import OpenAI from "openai";
import { getSetting } from "@/lib/config/settings";

/**
 * DeepSeek 官方 API 客户端 — 懒加载模式。
 *
 * API Key 从数据库 platform_settings 表动态读取（env 兜底），
 * 可在管理后台实时修改，无需重启服务。
 *
 * 官方文档: https://platform.deepseek.com/api-docs
 * API 地址: https://api.deepseek.com/v1（OpenAI 兼容接口）
 */

// 懒加载单例 — 首次调用时初始化，后续复用
let _deepseek: OpenAI | null = null;

/**
 * 获取 DeepSeek 客户端实例。
 * 首次调用时从数据库/环境变量读取 API Key 并创建连接。
 */
async function getDeepSeekClient(): Promise<OpenAI> {
  if (_deepseek) return _deepseek;

  const apiKey = await getSetting("deepseek_api_key");
  if (!apiKey) {
    throw new Error(
      "DeepSeek API key not configured. Go to Admin → Settings → API Configuration to set it, or set DEEPSEEK_API_KEY in .env.local."
    );
  }

  _deepseek = new OpenAI({
    baseURL: "https://api.deepseek.com/v1",
    apiKey,
  });

  return _deepseek;
}

/** 标准 chat completion 封装，带命名任务常用默认值 */
export async function chatCompletion(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
) {
  const client = await getDeepSeekClient();

  return client.chat.completions.create({
    model: options?.model || "deepseek-chat",
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2048,
    response_format: { type: "json_object" },
  });
}
