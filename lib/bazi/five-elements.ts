/**
 * Five Elements (五行) Character Database & Analysis
 *
 * Maps Chinese characters to their Five Elements attributes.
 * Used by the naming engine to recommend characters that balance
 * the user's Bazi chart.
 *
 * The character-element mapping follows traditional Chinese naming
 * conventions based on radical (部首) analysis.
 */

/** Characters organized by their Five Element, suitable for given names */
const ELEMENT_CHARS: Record<string, string[]> = {
  "金": [
    "铭", "钧", "锐", "锦", "钰", "铮", "锡", "铠",
    "鑫", "钦", "锟", "镕", "键", "镐",
  ],
  "木": [
    "林", "森", "桐", "楠", "楷", "柯", "栩", "枫",
    "柏", "松", "柳", "桦", "榕", "檀",
  ],
  "水": [
    "沐", "涵", "泽", "沛", "浩", "泓", "清", "澜",
    "源", "渊", "润", "潇", "瀚", "溪",
  ],
  "火": [
    "昭", "晖", "烨", "煜", "灿", "焕", "炫", "灵",
    "旭", "昕", "晟", "昊", "昱", "晰",
  ],
  "土": [
    "坤", "垚", "圭", "坦", "培", "圣", "城", "坚",
    "均", "基", "堂", "磊", "堃", "域",
  ],
};

/** All Five Elements in traditional order (相生: generating cycle) */
const ALL_ELEMENTS = ["金", "木", "水", "火", "土"] as const;

/**
 * Returns the elements missing from the user's Bazi chart.
 * An element is "missing" if its count is 0 or undefined.
 *
 * @param fiveElements - Map of element names to their counts
 * @returns Array of missing element names
 */
export function getMissingElements(
  fiveElements: Record<string, number>
): string[] {
  return ALL_ELEMENTS.filter(
    (e) => !fiveElements[e] || fiveElements[e] === 0
  );
}

/**
 * Returns the strongest element in the chart (highest count).
 * Used to determine the "day master support" characters.
 *
 * @param fiveElements - Map of element names to their counts
 * @returns The element with the highest count
 */
export function getStrongestElement(
  fiveElements: Record<string, number>
): string {
  const sorted = Object.entries(fiveElements).sort(
    ([, a], [, b]) => b - a
  );
  return sorted[0]?.[0] || "土";
}

/**
 * Given a single Chinese character, determine its Five Element.
 * Returns null if the character is not in our database.
 *
 * @param char - A single Chinese character
 * @returns The element name, or null if unknown
 */
export function getElementForChar(char: string): string | null {
  for (const [element, chars] of Object.entries(ELEMENT_CHARS)) {
    if (chars.includes(char)) return element;
  }
  return null;
}

/**
 * Returns candidate characters for a given element.
 *
 * @param element - One of the Five Elements (金/木/水/火/土)
 * @param limit - Maximum number of characters to return (default: 6)
 * @returns Array of characters belonging to that element
 */
export function getCharsForElement(
  element: string,
  limit: number = 6
): string[] {
  return (ELEMENT_CHARS[element] || []).slice(0, limit);
}

export { ELEMENT_CHARS, ALL_ELEMENTS };
