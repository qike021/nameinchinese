/**
 * PDF Report Generator
 *
 * Generates downloadable PDF reports for the Professional tier.
 * Uses @react-pdf/renderer (React components -> PDF document).
 *
 * The PDF includes:
 * - Certificate cover page with the user's English name and bestowed Chinese name
 * - Detailed name-by-name analysis with classical sources
 * - Optional Bazi and Five Elements analysis section
 */

import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { GeneratedName } from "@/lib/naming/engine";
import type { BaziResult } from "@/lib/bazi/client";

// -- PDF Styles -----------------------------------

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFBF5",
  },
  // Certificate cover
  certificateTitle: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  bestowedTo: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
    color: "#57534E",
  },
  englishName: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
  },
  chineseNameLarge: {
    fontSize: 48,
    textAlign: "center",
    fontFamily: "Noto Serif SC",
    color: "#991B1B",
    marginBottom: 8,
  },
  pinyin: {
    fontSize: 16,
    textAlign: "center",
    color: "#57534E",
    marginBottom: 20,
  },
  // Section formatting
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1C1917",
  },
  body: {
    fontSize: 12,
    lineHeight: 1.6,
    color: "#1C1917",
  },
  quote: {
    fontSize: 12,
    fontStyle: "italic",
    marginLeft: 16,
    marginBottom: 8,
    color: "#57534E",
  },
  pageBreak: {
    marginTop: 40,
    borderTop: "1px solid #D6D3D1",
    paddingTop: 20,
  },
});

// -- PDF Component --------------------------------

interface ReportData {
  englishName: string;
  names: GeneratedName[];
  baziResult: BaziResult | null;
}

/**
 * PDF Report React Component -- rendered to PDF by @react-pdf/renderer.
 * Do NOT import this in a client/server component -- it's PDF-only.
 */
function NameReport({ data }: { data: ReportData }) {
  return (
    <Document>
      {/* Page 1: Certificate Cover */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.certificateTitle}>
          ☯ 华名堂 NameInChinese ☯
        </Text>
        <Text style={styles.certificateTitle}>
          Chinese Name Certificate
        </Text>

        <View style={{ marginTop: 40 }}>
          <Text style={styles.bestowedTo}>
            This certifies that
          </Text>
          <Text style={styles.englishName}>
            {data.englishName}
          </Text>
          <Text style={styles.bestowedTo}>
            has been bestowed the Chinese name
          </Text>
        </View>

        {data.names.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.chineseNameLarge}>
              {data.names[0].chinese_name}
            </Text>
            <Text style={styles.pinyin}>
              {data.names[0].pinyin}
            </Text>
          </View>
        )}

        <View style={{ marginTop: 60, alignItems: "center" }}>
          <Text style={styles.body}>
            Certificate No: CN{Date.now().toString(36).toUpperCase()}
          </Text>
          <Text style={styles.body}>
            Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </Text>
        </View>
      </Page>

      {/* Pages 2+: Individual Name Details */}
      {data.names.map((name, index) => (
        <Page key={index} size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.chineseNameLarge}>
              {name.chinese_name}
            </Text>
            <Text style={styles.pinyin}>{name.pinyin}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meaning</Text>
            <Text style={styles.body}>{name.fullMeaning}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Classical Sources</Text>
            {name.characters.map((c, j) => (
              <View key={j}>
                <Text style={styles.quote}>
                  {c.char} -- {c.meaning} (Element: {c.element})
                </Text>
                <Text style={styles.quote}>From: {c.source}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cultural Story</Text>
            <Text style={styles.body}>{name.culturalStory}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pronunciation Guide</Text>
            <Text style={styles.body}>{name.pronunciationTip}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Best For</Text>
            <Text style={styles.body}>{name.bestFor}</Text>
          </View>
        </Page>
      ))}

      {/* Bazi Analysis Page (if available) */}
      {data.baziResult && (
        <Page size="A4" style={styles.page}>
          <View style={styles.pageBreak} />
          <Text style={styles.sectionTitle}>Five Elements & Bazi Analysis</Text>

          <View style={styles.section}>
            <Text style={styles.body}>
              Day Master: {data.baziResult.day_master} ({data.baziResult.day_master_element})
            </Text>
            <Text style={styles.body}>
              Four Pillars: {data.baziResult.year_pillar} / {data.baziResult.month_pillar} / {data.baziResult.day_pillar} / {data.baziResult.hour_pillar}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.body}>
              Five Elements Distribution: {JSON.stringify(data.baziResult.five_elements)}
            </Text>
            <Text style={styles.body}>
              Missing Elements: {data.baziResult.missing_elements.join(", ") || "none"}
            </Text>
          </View>
        </Page>
      )}
    </Document>
  );
}

// -- Public API -----------------------------------

/**
 * Generate a PDF report as a Buffer.
 *
 * @param data - The report data (user's name, generated names, optional Bazi)
 * @returns PDF file as a Node.js Buffer
 */
export async function generatePDF(data: ReportData): Promise<Buffer> {
  const pdfDocument = <NameReport data={data} />;
  return renderToBuffer(pdfDocument);
}
