import type { Dictionary } from "./en";

/**
 * Chinese (Simplified) translation — skeleton.
 * Phase 3: DeepSeek batch translation will fill in all values.
 * For now, falls through to English via the default behavior.
 */
const zh: Dictionary = {
  common: {
    siteName: "NameInChinese",
    siteChineseName: "华名堂",
    tagline: "你的中文名应该讲述一个故事，而不仅仅是翻译发音",
    cta: "获取我的中文名",
    loading: "加载中...",
    back: "返回",
    next: "下一步",
    submit: "提交",
    cancel: "取消",
  },
  // Partial translations — full translation in Phase 3
} as unknown as Dictionary;

export default zh;
