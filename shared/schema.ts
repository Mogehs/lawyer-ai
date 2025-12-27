import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql, relations } from "drizzle-orm";

export * from "./models/auth";

export const documentTypes = [
  "legal_memorandum",
  "contract",
  "statement_of_claim",
  "court_judgment",
  "legal_correspondence",
] as const;

export const documentPurposes = ["court", "internal", "client"] as const;
export const writingTones = ["formal", "professional", "concise"] as const;
export const jurisdictions = ["qatar", "gcc", "neutral"] as const;
export const memoStrengths = ["strong", "neutral", "defensive"] as const;

export const memorandumTypes = [
  "defense_memorandum",
  "response_memorandum",
  "reply_memorandum",
  "statement_of_claim",
  "appeal_memorandum",
  "legal_motion",
] as const;

export const translations = pgTable("translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sourceLanguage: varchar("source_language", { length: 2 }).notNull(),
  targetLanguage: varchar("target_language", { length: 2 }).notNull(),
  sourceText: text("source_text").notNull(),
  translatedText: text("translated_text").notNull(),
  documentType: varchar("document_type", { length: 50 }).notNull(),
  purpose: varchar("purpose", { length: 20 }).notNull(),
  tone: varchar("tone", { length: 20 }).notNull(),
  jurisdiction: varchar("jurisdiction", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const translationVersions = pgTable("translation_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  translationId: varchar("translation_id").notNull(),
  translatedText: text("translated_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const translationsRelations = relations(translations, ({ many }) => ({
  versions: many(translationVersions),
}));

export const translationVersionsRelations = relations(translationVersions, ({ one }) => ({
  translation: one(translations, {
    fields: [translationVersions.translationId],
    references: [translations.id],
  }),
}));

export const memorandums = pgTable("memorandums", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  language: varchar("language", { length: 2 }).notNull(),
  courtName: varchar("court_name", { length: 255 }).notNull(),
  caseNumber: varchar("case_number", { length: 100 }).notNull(),
  caseFacts: text("case_facts").notNull(),
  legalRequests: text("legal_requests").notNull(),
  defensePoints: text("defense_points"),
  strength: varchar("strength", { length: 20 }).notNull(),
  generatedContent: text("generated_content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const memorandumVersions = pgTable("memorandum_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memorandumId: varchar("memorandum_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const memorandumsRelations = relations(memorandums, ({ many }) => ({
  versions: many(memorandumVersions),
}));

export const memorandumVersionsRelations = relations(memorandumVersions, ({ one }) => ({
  memorandum: one(memorandums, {
    fields: [memorandumVersions.memorandumId],
    references: [memorandums.id],
  }),
}));

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
});

export const insertMemorandumSchema = createInsertSchema(memorandums).omit({
  id: true,
  createdAt: true,
});

export type Translation = typeof translations.$inferSelect & {
  versions: (typeof translationVersions.$inferSelect)[];
};
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;

export type Memorandum = typeof memorandums.$inferSelect & {
  versions: (typeof memorandumVersions.$inferSelect)[];
};
export type InsertMemorandum = z.infer<typeof insertMemorandumSchema>;
