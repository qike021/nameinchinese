import type { Dictionary } from "./en";

/**
 * Japanese translation — skeleton.
 * Phase 3: DeepSeek batch translation will fill in all values.
 * For now, falls through to English via the default behavior.
 */
const ja: Dictionary = {
  common: {
    siteName: "NameInChinese",
    siteChineseName: "華名堂",
    tagline: "あなたの中国語名は、音を訳すだけではなく、物語を語るべきです",
    cta: "中国語名を取得",
    loading: "読み込み中...",
    back: "戻る",
    next: "次へ",
    submit: "送信",
    cancel: "キャンセル",
  },
  // Partial translations — full translation in Phase 3
} as unknown as Dictionary;

export default ja;
