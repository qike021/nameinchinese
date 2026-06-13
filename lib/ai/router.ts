import { chatCompletion } from "./deepseek";

/**
 * DeepSeek 官方 API 模型标识。
 *
 * 主力: deepseek-chat（当前指向 DeepSeek 最新 chat 模型，支持 V4 Flash 级别能力）
 * 降级: deepseek-chat 在不同部署节点重试（同一模型ID，不同物理节点，极少同时挂）
 *
 * 注意: DeepSeek 官方 API 的模型 ID 可能随版本更新调整。
 * 请以 https://platform.deepseek.com/api-docs 实际可用的模型列表为准。
 */
const PRIMARY_MODEL = "deepseek-chat";
const FALLBACK_MODEL = "deepseek-chat"; // 同一模型，不同重试 = 不同物理节点

interface RouterOptions {
  temperature?: number;
  maxTokens?: number;
  /** Maximum retry attempts. Default: 1 (primary attempt + 1 retry) */
  retries?: number;
}

interface RouterResult {
  /** The parsed response from the AI */
  result: Awaited<ReturnType<typeof chatCompletion>>;
  /** Which model identifier was used */
  model: string;
  /** Which attempt number succeeded (0 = first try) */
  attempt: number;
}

/**
 * 发送 AI 请求，失败自动重试。
 *
 * DeepSeek 官方 API 的降级策略: 同一模型 ID 在不同请求间会被
 * 负载均衡到不同物理节点，因此重试本身就是有效的降级手段。
 *
 * @param messages  - 对话消息数组
 * @param options   - 路由配置
 * @returns AI 响应结果 + 元数据（用了哪个模型、第几次成功）
 * @throws 所有重试都失败时抛出
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
      console.warn(
        `[AI Router] 模型 ${model} 第 ${attempt + 1}/${maxRetries + 1} 次尝试失败:`,
        error instanceof Error ? error.message : error
      );

      if (attempt === maxRetries) {
        throw new Error(
          `所有 AI 请求均失败（共 ${maxRetries + 1} 次尝试）。最后错误: ${error instanceof Error ? error.message : "未知错误"}`
        );
      }

      // 短暂等待后重试，避免触发频率限制
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // TypeScript 要求此行，实际不会到达
  throw new Error("AI 路由异常: 已耗尽所有重试次数");
}

/**
 * 从 AI 响应文本中提取 JSON 对象或数组。
 *
 * 处理三种情况:
 * 1. Markdown 代码块包裹的 JSON (```json ... ```)
 * 2. 文本中嵌入的 JSON 对象/数组
 * 3. 整个响应就是纯 JSON
 */
export function extractJson<T = unknown>(content: string): T {
  // 优先尝试提取 markdown 代码块中的 JSON
  const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return JSON.parse(codeBlockMatch[1].trim()) as T;
  }

  // 其次查找文本中的 JSON 对象或数组
  const jsonMatch = content.match(/(\{[\s\S]*\})|(\[[\s\S]*\])/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]) as T;
  }

  // 兜底: 尝试解析整个内容
  return JSON.parse(content) as T;
}
