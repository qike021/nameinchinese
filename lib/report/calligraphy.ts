/**
 * Calligraphy SVG Renderer
 *
 * Generates SVG images of Chinese characters using web fonts.
 * Phase 1: Uses Google Fonts (Noto Serif SC) for basic calligraphic display.
 * Phase 2+: Can be upgraded to AI-generated calligraphy images.
 */

/** Calligraphy styles available for rendering */
export type CalligraphyStyle = "kaishu" | "xingshu" | "caoshu";

/** Font family mapping for each calligraphy style */
const STYLE_FONTS: Record<CalligraphyStyle, string> = {
  kaishu: "'Noto Serif SC', 'SimSun', serif",
  xingshu: "'ZCOOL KuaiLe', 'Noto Serif SC', cursive",
  caoshu: "'Liu Jian Mao Cao', 'Noto Serif SC', cursive",
};

/**
 * Generate an SVG image of Chinese text in a calligraphic style.
 *
 * @param text - The Chinese text to render (typically 2 characters for a name)
 * @param style - Calligraphy style: kaishu (regular), xingshu (semi-cursive), caoshu (cursive)
 * @param width - SVG canvas width in pixels (default: 400)
 * @param height - SVG canvas height in pixels (default: 200)
 * @returns SVG string ready for embedding or saving
 */
export function generateCalligraphySVG(
  text: string,
  style: CalligraphyStyle = "kaishu",
  width: number = 400,
  height: number = 200
): string {
  const fontFamily = STYLE_FONTS[style];
  const fontSize = Math.min(width / text.length / 2, 120);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      .calligraphy-text {
        font-family: ${fontFamily};
        font-size: ${fontSize}px;
        font-weight: 700;
        fill: #1a1a1a;
        text-anchor: middle;
        dominant-baseline: central;
      }
    </style>
  </defs>
  <rect width="${width}" height="${height}" fill="#FFFBF5" />
  <text x="${width / 2}" y="${height / 2}" class="calligraphy-text">${text}</text>
</svg>`;
}

/**
 * Generate a data URI for a calligraphy SVG (for inline use in HTML).
 *
 * @param text - Chinese text to render
 * @param style - Calligraphy style
 * @returns base64 data URI string
 */
export function generateCalligraphyDataUri(
  text: string,
  style: CalligraphyStyle = "kaishu"
): string {
  const svg = generateCalligraphySVG(text, style);
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}
