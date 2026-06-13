"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Save,
  RotateCcw,
  Key,
  Shield,
  Trash2,
  Server,
} from "lucide-react";

/** 配置项定义 */
interface SettingField {
  key: string;
  label: string;
  type: "text" | "password" | "url";
  placeholder: string;
  sensitive?: boolean;
}

/** API 配置区字段 */
const API_FIELDS: SettingField[] = [
  {
    key: "deepseek_api_key",
    label: "DeepSeek API Key",
    type: "password",
    placeholder: "sk-...",
    sensitive: true,
  },
  {
    key: "paypal_client_id",
    label: "PayPal Client ID",
    type: "text",
    placeholder: "Ab...",
  },
  {
    key: "paypal_secret",
    label: "PayPal Secret",
    type: "password",
    placeholder: "EG...",
    sensitive: true,
  },
  {
    key: "cnlunar_service_url",
    label: "cnlunar Service URL",
    type: "url",
    placeholder: "https://your-service.railway.app",
  },
];

/** Tab 定义 */
const TABS = [
  { id: "general", label: "General" },
  { id: "api", label: "API Configuration" },
  { id: "bazi", label: "Bazi Engine" },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("api");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── 加载配置 ──
  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setSettings(data.settings);
      // 初始化编辑框为当前值
      const init: Record<string, string> = {};
      for (const [key, value] of Object.entries(data.settings)) {
        init[key] = value as string;
      }
      setEditing(init);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // ── 保存配置 ──
  const handleSave = useCallback(async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: editing }),
      });
      if (!res.ok) throw new Error("Failed to save");

      const data = await res.json();
      setMessage({
        type: "success",
        text: `Saved ${data.updated?.length ?? 0} setting(s).`,
      });
      // 重新加载以获取脱敏后的值
      await loadSettings();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  }, [editing, loadSettings]);

  // ── 输入处理 ──
  const handleChange = (key: string, value: string) => {
    setEditing((prev) => ({ ...prev, [key]: value }));
  };

  // ── 显示值: 编辑中的值优先，否则用脱敏后的值 ──
  const displayValue = (key: string, serverValue: string): string => {
    if (editing[key] !== undefined && editing[key] !== serverValue) {
      return editing[key];
    }
    return serverValue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="font-heading text-[28px] font-bold text-text">Settings</h1>
        <p className="font-body text-sm text-text-muted mt-1">
          Configure your NameInChinese platform
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-border-light mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 font-body text-sm font-medium border-b-2 transition-colors -mb-[1px] ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-text-tertiary hover:text-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── 消息提示 ── */}
      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg font-body text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ── Tab: API Configuration ── */}
      {activeTab === "api" && (
        <div className="space-y-6">
          <div className="bg-surface rounded-xl shadow-sm border border-border-light p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Key className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-text">
                API Configuration
              </h2>
            </div>
            <p className="font-body text-sm text-text-tertiary mb-6">
              All API keys and service URLs are stored encrypted in the database.
              Sensitive values are masked — type a new value to overwrite.
            </p>

            <div className="space-y-5">
              {API_FIELDS.map((field) => (
                <div
                  key={field.key}
                  className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4"
                >
                  <label className="w-full sm:w-[200px] shrink-0 font-body text-sm font-medium text-text-secondary pt-2">
                    {field.label}
                  </label>
                  <div className="flex-1 relative">
                    <input
                      type={field.type}
                      value={displayValue(field.key, settings[field.key] || "")}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full h-11 px-4 rounded-lg border border-border bg-surface font-body text-sm text-text
                                 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                 placeholder:text-text-muted transition-colors"
                    />
                    {field.sensitive && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                        masked
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-border-light">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 h-11 px-6 bg-primary text-white rounded-lg font-body text-sm font-semibold
                           hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save API Configuration"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: General ── */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div className="bg-surface rounded-xl shadow-sm border border-border-light p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Server className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-text">
                Platform Settings
              </h2>
            </div>

            {/* Site Name */}
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <label className="w-full sm:w-[200px] shrink-0 font-body text-sm font-medium text-text-secondary pt-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={editing["site_name"] ?? "华名堂 NameInChinese"}
                  onChange={(e) => handleChange("site_name", e.target.value)}
                  className="flex-1 h-11 px-4 rounded-lg border border-border bg-surface font-body text-sm text-text
                             focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <label className="w-full sm:w-[200px] shrink-0 font-body text-sm font-medium text-text-secondary pt-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={editing["tagline"] ?? "Your Chinese Name Awaits"}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  className="flex-1 h-11 px-4 rounded-lg border border-border bg-surface font-body text-sm text-text
                             focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border-light">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 h-11 px-6 bg-primary text-white rounded-lg font-body text-sm font-semibold
                           hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Bazi Engine ── */}
      {activeTab === "bazi" && (
        <div className="space-y-6">
          <div className="bg-surface rounded-xl shadow-sm border border-border-light p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold text-text">
                Bazi Engine Configuration
              </h2>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <label className="w-full sm:w-[240px] shrink-0 font-body text-sm font-medium text-text-secondary pt-2">
                  Poetry Match Threshold
                </label>
                <input
                  type="text"
                  value={editing["poetry_match_threshold"] ?? "0.85"}
                  onChange={(e) => handleChange("poetry_match_threshold", e.target.value)}
                  className="flex-1 h-11 px-4 rounded-lg border border-border bg-surface font-body text-sm text-text
                             focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <label className="w-full sm:w-[240px] shrink-0 font-body text-sm font-medium text-text-secondary pt-2">
                  Max Names per Free Tier
                </label>
                <select
                  value={editing["max_names_free"] ?? "2"}
                  onChange={(e) => handleChange("max_names_free", e.target.value)}
                  className="flex-1 h-11 px-4 rounded-lg border border-border bg-surface font-body text-sm text-text
                             focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  {[1, 2, 3, 5].map((n) => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <label className="w-full sm:w-[240px] shrink-0 font-body text-sm font-medium text-text-secondary pt-2">
                  Max Names per Pro Tier
                </label>
                <select
                  value={editing["max_names_pro"] ?? "5"}
                  onChange={(e) => handleChange("max_names_pro", e.target.value)}
                  className="flex-1 h-11 px-4 rounded-lg border border-border bg-surface font-body text-sm text-text
                             focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  {[3, 5, 8, 10].map((n) => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border-light">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 h-11 px-6 bg-primary text-white rounded-lg font-body text-sm font-semibold
                           hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Update Engine Settings"}
              </button>
            </div>
          </div>

          {/* ── Danger Zone ── */}
          <div className="bg-surface rounded-xl border-2 border-red-200 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Trash2 className="h-5 w-5 text-error" />
              <h2 className="font-heading text-xl font-bold text-error">
                Danger Zone
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border-light">
                <div>
                  <p className="font-body text-sm font-medium text-text">Reset all statistics</p>
                  <p className="font-body text-xs text-text-muted mt-1">
                    Resets all platform statistics to zero
                  </p>
                </div>
                <button className="h-9 px-4 border-2 border-error text-error rounded-lg font-body text-sm font-medium
                                   hover:bg-red-50 transition-colors"
                >
                  Reset
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border-light">
                <div>
                  <p className="font-body text-sm font-medium text-text">Delete all test orders</p>
                  <p className="font-body text-xs text-text-muted mt-1">
                    Removes test-flagged orders
                  </p>
                </div>
                <button className="h-9 px-4 border-2 border-error text-error rounded-lg font-body text-sm font-medium
                                   hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-body text-sm font-medium text-text">Purge inactive users (90+ days)</p>
                  <p className="font-body text-xs text-text-muted mt-1">
                    Removes 90+ day inactive accounts
                  </p>
                </div>
                <button className="h-9 px-4 border-2 border-error text-error rounded-lg font-body text-sm font-medium
                                   hover:bg-red-50 transition-colors"
                >
                  Purge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 底部刷新 ── */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={loadSettings}
          className="inline-flex items-center gap-2 h-9 px-4 text-text-secondary border border-border rounded-lg
                     font-body text-sm hover:border-primary hover:text-primary transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>
    </div>
  );
}
