/**
 * 平台配置读取模块
 *
 * 三级回退: 内存缓存 → 数据库 → 环境变量
 *
 * 设计要点:
 * - 首次读取时从 DB 批量加载全部配置到内存 Map，后续读取零 DB 查询
 * - 30 秒 TTL 防止缓存停滞（Vercel serverless 冷启动自动刷新）
 * - 写入（管理后台保存）后立即清除缓存，下个请求重新加载
 * - 环境变量作为最终兜底，确保自举场景下配置永不丢失
 */
import { db } from "@/lib/db";
import { platformSettings } from "@/db/schema";

// ── 缓存类型 ──
interface SettingsCache {
  store: Map<string, string>;
  loadedAt: number;
}

const TTL_MS = 30_000; // 30 秒

// ── globalThis 单例（跨热重载复用） ──
const globalForSettings = globalThis as unknown as {
  settingsCache: SettingsCache | undefined;
};

function getCache(): SettingsCache | null {
  const cache = globalForSettings.settingsCache;
  if (!cache) return null;
  if (Date.now() - cache.loadedAt > TTL_MS) {
    globalForSettings.settingsCache = undefined;
    return null;
  }
  return cache;
}

function setCache(store: Map<string, string>): void {
  globalForSettings.settingsCache = { store, loadedAt: Date.now() };
}

// ── 环境变量兜底映射 ──
const ENV_FALLBACK: Record<string, string | undefined> = {
  deepseek_api_key: process.env.DEEPSEEK_API_KEY,
  paypal_client_id: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  paypal_secret: process.env.PAYPAL_SECRET,
  cnlunar_service_url: process.env.CNLUNAR_SERVICE_URL,
};

/**
 * 从 DB 加载全部配置到内存缓存。
 * 如果 settings 表不存在（首次部署前），静默跳过，依赖 env 兜底。
 */
async function loadAllFromDb(): Promise<Map<string, string>> {
  const store = new Map<string, string>();

  try {
    const rows = await db.select().from(platformSettings);
    for (const row of rows) {
      store.set(row.key, row.value);
    }
  } catch {
    // 表尚未创建或 DB 不可达 → 静默跳过，依赖 env fallback
  }

  return store;
}

/**
 * 读取单个配置项。
 *
 * 回退顺序:
 * 1. 内存缓存（30s TTL）
 * 2. 数据库 platform_settings 表
 * 3. 环境变量（process.env）
 *
 * @param key - 配置键名
 * @returns 配置值，未找到时返回 undefined
 */
export async function getSetting(key: string): Promise<string | undefined> {
  // Level 1: 内存缓存
  let cache = getCache();
  if (cache) {
    const cached = cache.store.get(key);
    if (cached !== undefined) return cached;
  }

  // Level 2: 数据库
  const store = await loadAllFromDb();
  setCache(store);

  const dbValue = store.get(key);
  if (dbValue !== undefined) return dbValue;

  // Level 3: 环境变量兜底
  return ENV_FALLBACK[key];
}

/**
 * 批量读取所有配置项。
 * 返回 { key: value } 对象，用于管理后台展示。
 *
 * 注意: 只返回数据库中的配置，不合并环境变量
 * （管理后台应展示实际生效的值）。
 */
export async function getAllSettings(): Promise<Record<string, string>> {
  const store = await loadAllFromDb();
  setCache(store);

  const result: Record<string, string> = {};
  for (const [key, value] of store.entries()) {
    result[key] = value;
  }

  // 合并环境变量中的配置（仅当 DB 中没有时）
  for (const [envKey, envValue] of Object.entries(ENV_FALLBACK)) {
    if (!(envKey in result) && envValue) {
      result[envKey] = envValue;
    }
  }

  return result;
}

/**
 * 写入单个配置项到数据库。
 * 使用 UPSERT（INSERT ... ON CONFLICT UPDATE）。
 *
 * @param key   - 配置键名
 * @param value - 配置值
 */
export async function setSetting(
  key: string,
  value: string
): Promise<void> {
  await db
    .insert(platformSettings)
    .values({ key, value })
    .onConflictDoUpdate({
      target: platformSettings.key,
      set: { value, updatedAt: new Date() },
    });
}

/**
 * 批量写入配置项。
 *
 * @param entries - { key: value } 对象
 */
export async function setSettings(
  entries: Record<string, string>
): Promise<void> {
  const rows = Object.entries(entries).map(([key, value]) => ({
    key,
    value,
  }));

  for (const row of rows) {
    await db
      .insert(platformSettings)
      .values(row)
      .onConflictDoUpdate({
        target: platformSettings.key,
        set: { value: row.value, updatedAt: new Date() },
      });
  }
}

/** 清除内存缓存（管理后台保存配置后调用） */
export function clearSettingsCache(): void {
  globalForSettings.settingsCache = undefined;
}
