import { z } from "zod";

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

export const translationSchema = z.object({
  id: z.string(),
  sourceLanguage: z.enum(["ar", "en"]),
  targetLanguage: z.enum(["ar", "en"]),
  sourceText: z.string(),
  translatedText: z.string(),
  documentType: z.enum(documentTypes),
  purpose: z.enum(documentPurposes),
  tone: z.enum(writingTones),
  jurisdiction: z.enum(jurisdictions),
  createdAt: z.string(),
  versions: z.array(z.object({
    id: z.string(),
    translatedText: z.string(),
    createdAt: z.string(),
  })),
});

export const insertTranslationSchema = translationSchema.omit({
  id: true,
  createdAt: true,
  versions: true,
});

export type Translation = z.infer<typeof translationSchema>;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;

export const memorandumSchema = z.object({
  id: z.string(),
  type: z.enum(memorandumTypes),
  language: z.enum(["ar", "en"]),
  courtName: z.string(),
  caseNumber: z.string(),
  caseFacts: z.string(),
  legalRequests: z.string(),
  defensePoints: z.string().optional(),
  strength: z.enum(memoStrengths),
  generatedContent: z.string(),
  createdAt: z.string(),
  versions: z.array(z.object({
    id: z.string(),
    content: z.string(),
    createdAt: z.string(),
  })),
});

export const insertMemorandumSchema = memorandumSchema.omit({
  id: true,
  createdAt: true,
  generatedContent: true,
  versions: true,
});

export type Memorandum = z.infer<typeof memorandumSchema>;
export type InsertMemorandum = z.infer<typeof insertMemorandumSchema>;

export const users = {
  id: "",
  username: "",
  password: "",
};

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = {
  id: string;
  username: string;
  password: string;
};
