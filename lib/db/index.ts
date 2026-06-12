import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

/**
 * Server-side database client with Drizzle ORM.
 * Uses the DATABASE_URL connection string.
 * Singleton pattern — reuse the connection in serverless functions.
 */
const globalForDb = globalThis as unknown as { db: ReturnType<typeof drizzle> | undefined };

function createDb() {
  const client = postgres(process.env.DATABASE_URL!);
  return drizzle(client, { schema });
}

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
