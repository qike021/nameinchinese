/**
 * AI Prompt templates for NameInChinese.
 * All prompts require JSON output for structured parsing.
 * Templates use {placeholder} syntax — replace with actual values before sending.
 */

/** English name etymology analysis — step 1 of the naming pipeline */
export const ETYMOLOGY_PROMPT = `You are an expert in English name etymology.
Analyze the origin and original meaning of the given English name.

Input: {englishName}

Return a JSON object:
{
  "origin": "Latin 'Aemilia'",
  "originalMeaning": "rival, striving, industrious",
  "culturalConcepts": ["excellence", "diligence", "brightness"],
  "personalityTraits": ["competitive", "hardworking", "ambitious"]
}`;

/** Core naming prompt — step 3 of the naming pipeline (after etymology + bazi) */
export const NAMING_PROMPT = `You are a master of Chinese cultural naming.
Create meaningful Chinese names for a non-Chinese speaker based on their profile.

【Client Information】
- English name: {englishName}
- Name origin meaning: {originMeaning}
- Cultural concepts: {culturalConcepts}
- Gender: {gender}
- Profession: {profession}
- Personality: {personality}
- Preferred style: {preferredStyle}
- Purpose: {purpose}
- Five Elements profile (if available): {baziProfile}

【Naming Requirements】
1. Each name must reference Chinese classical literature (Shijing / Chuci / Tang poetry / Song ci / philosophy)
2. The name should reflect the MEANING of their English name, NOT just phonetic translation
3. Use 2 characters — surname-compatible character + given name character
4. Avoid: homophones with negative meanings, overly common names, characters too difficult for beginners to write
5. If Five Elements data is provided, prioritize characters that balance the missing elements

For each name, provide:
- chinese_name: Chinese characters
- pinyin: Pinyin with tone marks
- characters: array of {char, meaning, element, source} for each character
- source: dynasty, author, work, and original quote
- fullMeaning: what the name means as a whole and why it fits this person
- culturalStory: 2-3 sentence cultural story in English
- bestFor: which purpose this name is best suited for
- pronunciationTip: how an English speaker should pronounce it

Return a JSON array of {count} names.`;

/** Tattoo safety review prompt */
export const TATTOO_REVIEW_PROMPT = `You are an expert in Chinese character tattoo safety.
Review the following text intended for a tattoo: "{tattooText}"

Check for:
1. Correct grammar and character usage — are the characters well-formed Chinese?
2. Any inappropriate, offensive, or absurd literal meanings
3. Any homophones (words that sound similar) with negative or embarrassing meanings
4. Whether the characters form a coherent, meaningful phrase
5. Whether this would be appropriate as a permanent tattoo

Return a JSON object:
{
  "status": "safe" | "warning" | "danger",
  "actualMeaning": "what the text literally means in English",
  "intendedMeaning": "what the user likely wants it to mean",
  "issues": ["list of specific problems found, if any"],
  "suggestion": "corrected text if the original is problematic",
  "explanation": "detailed explanation in English suitable for a non-Chinese speaker"
}`;

/** Multi-language translation prompt — Phase 3 bulk translation */
export const TRANSLATION_PROMPT = `You are a professional translator.
Translate the following UI strings from English to {targetLanguage}.

Preserve all {placeholder} variables exactly as-is.
Preserve all HTML tags and markdown formatting.
Return a JSON object with the same keys as the input.

Input: {jsonInput}`;
