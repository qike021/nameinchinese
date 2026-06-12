import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

/** English name → Chinese character mapping knowledge base (core IP) */
export const nameMappings = pgTable("name_mappings", {
  id: uuid("id").defaultRandom().primaryKey(),
  englishName: text("english_name").notNull().unique(),
  origin: text("origin"),
  originalMeaning: text("original_meaning"),
  chineseCharacters: jsonb("chinese_characters"),
  suggestedNames: jsonb("suggested_names"),
  avoid: jsonb("avoid"),
  createdAt: timestamp("created_at").defaultNow(),
});

/** Classical Chinese poetry corpus for RAG retrieval */
export const poetry = pgTable("poetry", {
  id: uuid("id").defaultRandom().primaryKey(),
  dynasty: text("dynasty").notNull(),
  author: text("author").notNull(),
  work: text("work").notNull(),
  quote: text("quote").notNull(),
  characters: text("characters").array(),
  themes: text("themes").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

/** Reference to Supabase auth.users */
export const authUsers = pgTable("auth_users", {
  id: uuid("id").primaryKey(),
  email: text("email"),
});

/** Payment orders */
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => authUsers.id),
  tier: text("tier").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").default("usd"),
  status: text("status").default("pending"),
  paymentMethod: text("payment_method"),
  paymentId: text("payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

/** Generated Chinese name records */
export const generatedNames = pgTable("generated_names", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id),
  userId: uuid("user_id").references(() => authUsers.id),
  englishName: text("english_name").notNull(),
  inputProfile: jsonb("input_profile"),
  baziResult: jsonb("bazi_result"),
  names: jsonb("names"),
  createdAt: timestamp("created_at").defaultNow(),
});

/** Tattoo safety review records */
export const tattooReviews = pgTable("tattoo_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => authUsers.id),
  requestedText: text("requested_text").notNull(),
  reviewResult: jsonb("review_result"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});
