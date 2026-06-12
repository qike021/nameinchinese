/**
 * POST /api/tattoo/review
 *
 * AI-powered Chinese tattoo text safety review.
 * Accepts text input, sends to AI with TATTOO_REVIEW_PROMPT,
 * returns structured review result, and persists to tattoo_reviews table.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tattooReviews } from "@/db/schema";
import { routeAIRequest, extractJson } from "@/lib/ai/router";
import { TATTOO_REVIEW_PROMPT } from "@/lib/ai/prompts";

interface ReviewResult {
  status: "safe" | "warning" | "danger";
  actualMeaning: string;
  intendedMeaning: string;
  issues: string[];
  suggestion: string;
  explanation: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ── Validate required fields ──
    if (!body.text || typeof body.text !== "string" || body.text.trim().length === 0) {
      return NextResponse.json(
        { error: "text is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const text = body.text.trim();

    if (text.length > 200) {
      return NextResponse.json(
        { error: "text must be 200 characters or fewer" },
        { status: 400 }
      );
    }

    // ── Send to AI for review ──
    const prompt = TATTOO_REVIEW_PROMPT.replace("{tattooText}", text);

    const { result } = await routeAIRequest([
      {
        role: "system",
        content:
          "You are an expert in Chinese character tattoo safety. Always respond with valid JSON matching the requested schema.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);

    const content = result.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("AI returned empty response");
    }

    const reviewResult = extractJson<ReviewResult>(content);

    // ── Validate AI response shape ──
    if (!["safe", "warning", "danger"].includes(reviewResult.status)) {
      reviewResult.status = "warning";
    }

    // ── Save to database ──
    const [saved] = await db
      .insert(tattooReviews)
      .values({
        requestedText: text,
        reviewResult: reviewResult as unknown as Record<string, unknown>,
        status: "completed",
      })
      .returning({ id: tattooReviews.id });

    return NextResponse.json({
      id: saved.id,
      review: reviewResult,
    });
  } catch (error) {
    console.error("[API] Tattoo review failed:", error);

    const message =
      error instanceof Error ? error.message : "Failed to review tattoo text";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
