/**
 * NameInChinese — 设计系统验证页
 *
 * 此页面用于验证所有 Design System 元素是否正确加载：
 * - 品牌色 (primary #991B1B)
 * - 背景色 (bg #FFFBF5)
 * - 字体 (Cormorant 标题 + Montserrat 正文 + Noto Serif SC 中文)
 * - 按钮变体 (primary / outline / ghost / block)
 * - 卡片 (surface + 阴影 + 圆角)
 *
 * 开发完成后此页面将被首页替换。
 */

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 bg-bg">
      {/* ---- 品牌标识 ---- */}
      <h1 className="font-heading text-6xl font-bold text-primary">
        NameInChinese
      </h1>
      <p className="font-cjk text-4xl text-primary">华名堂</p>
      <p className="font-body text-text-secondary text-lg">
        Your Chinese Name Awaits
      </p>

      {/* ---- 按钮系统 ---- */}
      <div className="flex gap-4 flex-wrap justify-center mt-4">
        <button className="btn btn-primary btn-lg">Get Started</button>
        <button className="btn btn-outline btn-lg">Learn More</button>
        <button className="btn btn-ghost btn-md">Ghost Button</button>
      </div>
      <button className="btn btn-block max-w-md mt-2">
        Block Button (Full Width)
      </button>

      {/* ---- 颜色色板 ---- */}
      <div className="flex gap-3 flex-wrap justify-center mt-4">
        {[
          { label: "primary", bg: "bg-primary" },
          { label: "hover", bg: "bg-primary-hover" },
          { label: "light", bg: "bg-primary-light" },
          { label: "bg", bg: "bg-bg", border: true },
          { label: "surface", bg: "bg-surface", border: true },
          { label: "surface-alt", bg: "bg-surface-alt" },
          { label: "surface-dark", bg: "bg-surface-dark" },
          { label: "text", bg: "bg-text" },
        ].map(({ label, bg, border }) => (
          <div key={label} className="text-center">
            <div
              className={`w-12 h-12 rounded-md ${bg} ${
                border ? "border border-border" : ""
              }`}
            />
            <p className="text-xs text-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ---- 名字卡片示例 ---- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-8">
        {[
          {
            cn: "昭韵",
            pinyin: "Zhāo Yùn",
            meaning: "Bright & Poetic",
            shadow: "shadow-sm",
          },
          {
            cn: "铭凯",
            pinyin: "Míng Kǎi",
            meaning: "Triumphant & Strong",
            shadow: "shadow-md",
          },
          {
            cn: "慧然",
            pinyin: "Huì Rán",
            meaning: "Wise & Natural",
            shadow: "shadow-lg",
          },
        ].map(({ cn, pinyin, meaning, shadow }) => (
          <div
            key={cn}
            className={`bg-surface rounded-xl p-6 border border-border-light ${shadow}`}
          >
            <p className="font-cjk text-4xl font-bold text-primary">{cn}</p>
            <p className="text-text-secondary text-sm mt-1">{pinyin}</p>
            <p className="text-text-tertiary text-xs mt-2">{meaning}</p>
          </div>
        ))}
      </div>

      {/* ---- 页脚标注 ---- */}
      <p className="text-text-muted text-xs mt-8">
        华名堂 NameInChinese · Design System Verification · 2026
      </p>
    </main>
  );
}
