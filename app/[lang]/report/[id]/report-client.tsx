"use client";

import { NameDetail } from "@/components/report/name-detail";
import { BaziAnalysis } from "@/components/report/bazi-analysis";
import type { ReportCharacter } from "@/components/report/name-detail";

// ── Types ──

interface NameRecord {
  chinese_name: string;
  pinyin: string;
  characters: ReportCharacter[];
  fullMeaning: string;
  culturalStory: string;
  pronunciationTip: string;
  bestFor: string;
}

interface BaziRecord {
  year_pillar: string;
  month_pillar: string;
  day_pillar: string;
  hour_pillar: string;
  day_master: string;
  day_master_element: string;
  five_elements: Record<string, number>;
  missing_elements: string[];
}

interface ReportClientProps {
  names: NameRecord[];
  baziResult: BaziRecord | null;
  reportId: string;
}

// ── Day Master Explanations ──

const DAY_MASTER_EXPLANATIONS: Record<string, string> = {
  "甲": "Jia Wood (Yang) — like a mighty tree, you are strong, independent, and growth-oriented. Your personality is expansive and upright.",
  "乙": "Yi Wood (Yin) — like a flowering vine, you are flexible, artistic, and adaptable. You thrive through grace and persistence.",
  "丙": "Bing Fire (Yang) — like the blazing sun, you are radiant, charismatic, and warm. Your presence lights up any room.",
  "丁": "Ding Fire (Yin) — like a candle flame, you are gentle, focused, and refined. You illuminate through precision and care.",
  "戊": "Wu Earth (Yang) — like a mountain, you are stable, reliable, and grounded. You provide a solid foundation for others.",
  "己": "Ji Earth (Yin) — like fertile soil, you are nurturing, thoughtful, and receptive. You help ideas and people grow.",
  "庚": "Geng Metal (Yang) — like unrefined ore, you are strong-willed, decisive, and resilient. You shape the world around you.",
  "辛": "Xin Metal (Yin) — like polished jade, you are refined, elegant, and perceptive. You notice the finest details.",
  "壬": "Ren Water (Yang) — like a great river, you are powerful, adventurous, and unstoppable. You carve your own path.",
  "癸": "Gui Water (Yin) — like gentle rain, you are intuitive, deep, and mysterious. You understand the hidden currents of life.",
};

/**
 * ReportClient — renders the report content on the client.
 *
 * Shows all names in a vertical list with full detail for each,
 * followed by the Bazi analysis section (if available).
 */
export function ReportClient({ names, baziResult, reportId }: ReportClientProps) {
  return (
    <div className="space-y-8 md:space-y-10">
      {/* ── Name Details ── */}
      {names.length > 0 && (
        <div className="space-y-6 md:space-y-8">
          {names.map((name, index) => (
            <NameDetail
              key={index}
              chineseName={name.chinese_name}
              pinyin={name.pinyin}
              characters={name.characters}
              fullMeaning={name.fullMeaning}
              culturalStory={name.culturalStory}
              pronunciationTip={name.pronunciationTip}
              bestFor={name.bestFor}
              isBestMatch={index === 0}
              bestMatchLabel="Best Match"
              index={index}
            />
          ))}
        </div>
      )}

      {/* ── Bazi Analysis ── */}
      {baziResult && (
        <div className="mt-8 md:mt-10">
          <BaziAnalysis
            yearPillar={baziResult.year_pillar}
            monthPillar={baziResult.month_pillar}
            dayPillar={baziResult.day_pillar}
            hourPillar={baziResult.hour_pillar}
            dayMaster={baziResult.day_master}
            dayMasterElement={baziResult.day_master_element}
            fiveElements={baziResult.five_elements}
            missingElements={baziResult.missing_elements}
            dayMasterExplanation={
              baziResult.day_master
                ? DAY_MASTER_EXPLANATIONS[baziResult.day_master] ||
                  `Your Day Master is ${baziResult.day_master} (${baziResult.day_master_element}). This represents your core personality in Chinese metaphysics.`
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
