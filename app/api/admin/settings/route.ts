/**
 * GET  /api/admin/settings — 获取全部平台配置（敏感值脱敏）
 * PUT  /api/admin/settings — 批量更新平台配置
 *
 * Auth: 复用 admin auth 模式 — 需要有效 Supabase session。
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  getAllSettings,
  setSettings,
  clearSettingsCache,
} from "@/lib/config/settings";

/** 敏感配置键：返回时只显示后 4 位 */
const SENSITIVE_KEYS = ["deepseek_api_key", "paypal_secret"];

/** 脱敏：保留后 4 位，其余替换为星号 */
function maskValue(value: string): string {
  if (!value || value.length <= 4) return "••••";
  return "••••" + value.slice(-4);
}

// ── GET ──
export async function GET() {
  try {
    // Auth check
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized — authentication required" },
        { status: 401 }
      );
    }

    const settings = await getAllSettings();

    // 脱敏敏感字段
    const masked: Record<string, string> = {};
    for (const [key, value] of Object.entries(settings)) {
      masked[key] = SENSITIVE_KEYS.includes(key) ? maskValue(value) : value;
    }

    return NextResponse.json({ settings: masked });
  } catch (error) {
    console.error("[API] Failed to get settings:", error);
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

// ── PUT ──
export async function PUT(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized — authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.settings || typeof body.settings !== "object") {
      return NextResponse.json(
        { error: "settings object is required" },
        { status: 400 }
      );
    }

    // 只保存非空的配置项（空值不写入 DB）
    const entries: Record<string, string> = {};
    for (const [key, value] of Object.entries(body.settings)) {
      if (typeof value === "string" && value.trim() !== "") {
        entries[key] = value.trim();
      }
    }

    await setSettings(entries);

    // 清除内存缓存，确保下次读取时从 DB 重新加载
    clearSettingsCache();

    return NextResponse.json({ success: true, updated: Object.keys(entries) });
  } catch (error) {
    console.error("[API] Failed to save settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
