import type { Dictionary } from "./en";

/**
 * Korean translation — skeleton.
 * Phase 3: DeepSeek batch translation will fill in all values.
 * For now, falls through to English via the default behavior.
 */
const ko: Dictionary = {
  common: {
    siteName: "NameInChinese",
    siteChineseName: "화명당",
    tagline: "중국어 이름은 단순한 음역이 아닌, 이야기를 담고 있어야 합니다",
    cta: "중국어 이름 받기",
    loading: "로딩 중...",
    back: "뒤로",
    next: "다음",
    submit: "제출",
    cancel: "취소",
  },
  // Partial translations — full translation in Phase 3
} as unknown as Dictionary;

export default ko;
