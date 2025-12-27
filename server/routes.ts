import type { Express, Request } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { documentTypes, documentPurposes, writingTones, jurisdictions, memorandumTypes, memoStrengths, insertSiteSettingsSchema } from "@shared/schema";
import { setupAuth, registerAuthRoutes, isAuthenticated, isAdmin, attachUser, logAudit, type AuthenticatedRequest } from "./auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyDOnEdn5Y4PIALaHGeGjAKMnkNzsc7gQJs");

const translateRequestSchema = z.object({
  sourceText: z.string().min(1, "Source text is required"),
  sourceLanguage: z.enum(["ar", "en"]),
  targetLanguage: z.enum(["ar", "en"]),
  documentType: z.enum(documentTypes),
  purpose: z.enum(documentPurposes),
  tone: z.enum(writingTones),
  jurisdiction: z.enum(jurisdictions),
});

const generateMemoRequestSchema = z.object({
  type: z.enum(memorandumTypes),
  language: z.enum(["ar", "en"]),
  courtName: z.string().min(1, "Court name is required"),
  caseNumber: z.string().min(1, "Case number is required"),
  caseFacts: z.string().min(1, "Case facts are required"),
  legalRequests: z.string().min(1, "Legal requests are required"),
  defensePoints: z.string().optional(),
  strength: z.enum(memoStrengths),
});

function isOpenAIConfigured(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  return !!apiKey;
}

function getUserId(req: Request): string {
  return req.session.userId || "";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get("/api/translations", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = getUserId(req);
      const translations = await storage.getTranslations(userId);
      res.json(translations);
    } catch (error) {
      console.error("Error fetching translations:", error);
      res.status(500).json({ error: "Failed to fetch translations" });
    }
  });

  app.get("/api/translations/:id", isAuthenticated, async (req, res) => {
    try {
      const translation = await storage.getTranslation(req.params.id);
      if (!translation) {
        return res.status(404).json({ error: "Translation not found" });
      }
      res.json(translation);
    } catch (error) {
      console.error("Error fetching translation:", error);
      res.status(500).json({ error: "Failed to fetch translation" });
    }
  });

  app.post("/api/translate", isAuthenticated, async (req: Request, res) => {
    try {
      const parseResult = translateRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: parseResult.error.errors 
        });
      }

      const { sourceText, sourceLanguage, targetLanguage, documentType, purpose, tone, jurisdiction } = parseResult.data;
      const deterministic = req.body.deterministic === true;
      const userId = getUserId(req);

      if (!isOpenAIConfigured()) {
        return res.status(503).json({ 
          error: "AI service is not configured. Please contact your administrator." 
        });
      }

      const systemPrompt = buildTranslationPrompt(sourceLanguage, targetLanguage, documentType, purpose, tone, jurisdiction);

      let translatedText: string;
      try {
        const model = genAI.getGenerativeModel({ 
          model: process.env.GEMINI_MODEL || "gemini-2.0-flash-exp",
          generationConfig: {
            temperature: deterministic ? 0 : 0.3,
            topP: deterministic ? 0.1 : 0.9,
            maxOutputTokens: 4096,
          },
        });
        
        const prompt = `${systemPrompt}\n\n${sourceText}`;
        const result = await model.generateContent(prompt);
        translatedText = result.response.text() || "";
      } catch (aiError) {
        console.error("Gemini API error:", aiError);
        return res.status(503).json({ 
          error: "AI translation service is temporarily unavailable. Please try again later." 
        });
      }

      const translation = await storage.createTranslation({
        userId,
        sourceLanguage,
        targetLanguage,
        sourceText,
        translatedText,
        documentType,
        purpose,
        tone,
        jurisdiction,
      });

      const user = await storage.getUserById(userId);
      if (user) {
        await logAudit(userId, user.email, "translation_create", req, { 
          translationId: translation.id, 
          documentType, 
          sourceLanguage, 
          targetLanguage 
        });
      }

      res.json(translation);
    } catch (error) {
      console.error("Error translating:", error);
      res.status(500).json({ error: "Failed to translate text" });
    }
  });

  app.delete("/api/translations/:id", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUserById(userId);
      if (user) {
        await logAudit(userId, user.email, "translation_delete", req, { translationId: req.params.id });
      }
      await storage.deleteTranslation(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting translation:", error);
      res.status(500).json({ error: "Failed to delete translation" });
    }
  });

  app.get("/api/memorandums", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = getUserId(req);
      const memorandums = await storage.getMemorandums(userId);
      res.json(memorandums);
    } catch (error) {
      console.error("Error fetching memorandums:", error);
      res.status(500).json({ error: "Failed to fetch memorandums" });
    }
  });

  app.get("/api/memorandums/:id", isAuthenticated, async (req, res) => {
    try {
      const memorandum = await storage.getMemorandum(req.params.id);
      if (!memorandum) {
        return res.status(404).json({ error: "Memorandum not found" });
      }
      res.json(memorandum);
    } catch (error) {
      console.error("Error fetching memorandum:", error);
      res.status(500).json({ error: "Failed to fetch memorandum" });
    }
  });

  app.post("/api/memorandums/generate", isAuthenticated, async (req: Request, res) => {
    try {
      const parseResult = generateMemoRequestSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: parseResult.error.errors 
        });
      }

      const { type, language, courtName, caseNumber, caseFacts, legalRequests, defensePoints, strength } = parseResult.data;
      const userId = getUserId(req);

      if (!isOpenAIConfigured()) {
        return res.status(503).json({ 
          error: "AI service is not configured. Please contact your administrator." 
        });
      }

      const systemPrompt = buildMemorandumPrompt(type, language, strength);
      const userPrompt = buildMemorandumUserPrompt(language, courtName, caseNumber, caseFacts, legalRequests, defensePoints);

      let generatedContent: string;
      try {
        const model = genAI.getGenerativeModel({ 
          model: process.env.GEMINI_MODEL || "gemini-2.0-flash-exp",
          generationConfig: {
            maxOutputTokens: 8192,
          },
        });
        
        const prompt = `${systemPrompt}\n\n${userPrompt}`;
        const result = await model.generateContent(prompt);
        generatedContent = result.response.text() || "";
      } catch (aiError) {
        console.error("Gemini API error:", aiError);
        return res.status(503).json({ 
          error: "AI drafting service is temporarily unavailable. Please try again later." 
        });
      }

      const memorandum = await storage.createMemorandum({
        userId,
        type,
        language,
        courtName,
        caseNumber,
        caseFacts,
        legalRequests,
        defensePoints,
        strength,
        generatedContent,
      });

      const user = await storage.getUserById(userId);
      if (user) {
        await logAudit(userId, user.email, "memorandum_create", req, { 
          memorandumId: memorandum.id, 
          type, 
          language,
          caseNumber 
        });
      }

      res.json(memorandum);
    } catch (error) {
      console.error("Error generating memorandum:", error);
      res.status(500).json({ error: "Failed to generate memorandum" });
    }
  });

  app.delete("/api/memorandums/:id", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUserById(userId);
      if (user) {
        await logAudit(userId, user.email, "memorandum_delete", req, { memorandumId: req.params.id });
      }
      await storage.deleteMemorandum(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting memorandum:", error);
      res.status(500).json({ error: "Failed to delete memorandum" });
    }
  });

  app.get("/api/stats", isAuthenticated, async (req: Request, res) => {
    try {
      const userId = getUserId(req);
      const translations = await storage.getTranslations(userId);
      const memorandums = await storage.getMemorandums(userId);
      
      res.json({
        totalTranslations: translations.length,
        totalMemorandums: memorandums.length,
        recentTranslations: translations.slice(0, 5),
        recentMemorandums: memorandums.slice(0, 5),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings || {
        id: "default",
        logoUrl: null,
        appTitle: "AI Legal System",
        appSubtitle: null,
        footerText: null,
        updatedAt: null,
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", isAuthenticated, attachUser, isAdmin, async (req: Request, res) => {
    try {
      const parseResult = insertSiteSettingsSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: parseResult.error.errors 
        });
      }

      const authReq = req as AuthenticatedRequest;
      if (authReq.user) {
        await logAudit(authReq.user.id, authReq.user.email, "settings_update", req, parseResult.data);
      }

      const settings = await storage.updateSiteSettings(parseResult.data);
      res.json(settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.get("/api/admin/users", isAuthenticated, attachUser, isAdmin, async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ passwordHash: _, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id/role", isAuthenticated, attachUser, isAdmin, async (req: Request, res) => {
    try {
      const { role } = req.body;
      if (!role || !["admin", "user"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      const authReq = req as AuthenticatedRequest;
      const targetUser = await storage.getUserById(req.params.id);
      
      if (authReq.user && targetUser) {
        await logAudit(authReq.user.id, authReq.user.email, "user_role_update", req, { 
          targetUserId: req.params.id, 
          targetUserEmail: targetUser.email,
          newRole: role,
          previousRole: targetUser.role
        });
      }

      const user = await storage.updateUser(req.params.id, { role } as any);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  app.get("/api/admin/audit-logs", isAuthenticated, attachUser, isAdmin, async (req: Request, res) => {
    try {
      const parsedLimit = parseInt(req.query.limit as string);
      const limit = Number.isNaN(parsedLimit) || parsedLimit <= 0 ? 100 : Math.min(parsedLimit, 500);
      const logs = await storage.getAuditLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  return httpServer;
}

function buildTranslationPrompt(
  sourceLanguage: string,
  targetLanguage: string,
  documentType: string,
  purpose: string,
  tone: string,
  jurisdiction: string
): string {
  const sourceLang = sourceLanguage === "ar" ? "Arabic" : "English";
  const targetLang = targetLanguage === "ar" ? "Arabic" : "English";

  const documentTypeMap: Record<string, string> = {
    legal_memorandum: "legal memorandum",
    contract: "contract",
    statement_of_claim: "statement of claim",
    court_judgment: "court judgment",
    legal_correspondence: "legal correspondence",
  };

  const purposeMap: Record<string, string> = {
    court: "court submission",
    internal: "internal use",
    client: "client communication",
  };

  const toneMap: Record<string, string> = {
    formal: "highly formal and ceremonial",
    professional: "professional and business-like",
    concise: "clear and concise",
  };

  const jurisdictionMap: Record<string, string> = {
    qatar: "Qatari legal system",
    gcc: "GCC regional legal standards",
    neutral: "international legal standards",
  };

  return `You are an expert bilingual legal translator with deep expertise in both ${sourceLang} and ${targetLang} legal systems.

DOCUMENT TYPE: ${documentTypeMap[documentType] || documentType}
PURPOSE: ${purposeMap[purpose] || purpose}
TONE: ${toneMap[tone] || tone}
JURISDICTION: ${jurisdictionMap[jurisdiction] || jurisdiction}

CRITICAL RULES - MUST FOLLOW:
1. ALWAYS provide the translation. Never refuse, comment on your capabilities, or discuss training data.
2. NEVER fabricate or hallucinate legal citations, case references, article numbers, or law references that are not in the source text.
3. Only translate what is present in the source - do not add content that does not exist.
4. Each translation is isolated - do not reference or include information from any other documents or cases.

TRANSLATION GUIDELINES:
1. Use context-aware legal translation appropriate for ${jurisdictionMap[jurisdiction] || jurisdiction}
2. Preserve exact legal terminology with precise ${targetLang} equivalents
3. Maintain the ${toneMap[tone] || tone} tone throughout
4. Keep original document structure and formatting
5. Use jurisdiction-appropriate legal phrasing and conventions
6. Translate legal terms with their established equivalents (not literal translations)
7. Preserve paragraph breaks, numbering, and document organization
8. For Arabic output: use formal Modern Standard Arabic (الفصحى) suitable for legal proceedings
9. For English output: use formal legal English suitable for court submissions

OUTPUT: Provide ONLY the translated text. No explanations, notes, or commentary.

Translate the following ${documentTypeMap[documentType] || documentType} from ${sourceLang} to ${targetLang}:`;
}

function buildMemorandumPrompt(type: string, language: string, strength: string): string {
  const isArabic = language === "ar";

  const typeMap: Record<string, { en: string; ar: string }> = {
    defense_memorandum: { en: "Defense Memorandum", ar: "مذكرة دفاع" },
    response_memorandum: { en: "Response Memorandum", ar: "مذكرة رد" },
    reply_memorandum: { en: "Reply Memorandum", ar: "مذكرة جوابية" },
    statement_of_claim: { en: "Statement of Claim", ar: "صحيفة دعوى" },
    appeal_memorandum: { en: "Appeal Memorandum", ar: "مذكرة استئناف" },
    legal_motion: { en: "Legal Motion", ar: "طلب قانوني" },
  };

  const strengthMap: Record<string, { en: string; ar: string }> = {
    strong: { en: "assertive and compelling", ar: "قوية ومقنعة" },
    neutral: { en: "balanced and objective", ar: "متوازنة وموضوعية" },
    defensive: { en: "cautious and protective", ar: "حذرة ودفاعية" },
  };

  const docType = typeMap[type] || { en: type, ar: type };
  const strengthStyle = strengthMap[strength] || { en: strength, ar: strength };

  if (isArabic) {
    return `أنت محامٍ خبير متخصص في صياغة المذكرات القانونية باللغة العربية.

نوع المذكرة: ${docType.ar}
أسلوب الصياغة: ${strengthStyle.ar}

قواعد حاسمة - يجب اتباعها:
1. لا تستشهد بأي قوانين أو مواد أو أحكام قضائية غير مذكورة في المعلومات المقدمة
2. لا تخترع أرقام مواد أو أسماء قوانين أو مراجع قضائية
3. استخدم فقط المعلومات المقدمة - لا تضف محتوى من قضايا أخرى
4. كل مذكرة مستقلة - لا تشر إلى وثائق أو قضايا أخرى

إرشادات الصياغة:
1. استخدم اللغة القانونية العربية الفصحى المناسبة للمحاكم
2. اتبع الهيكل القانوني المعتمد في المحاكم
3. قدم تحليلاً قانونياً منطقياً للوقائع
4. استخدم العبارات القانونية الرسمية والمعتمدة
5. اجعل الحجج القانونية قوية ومتماسكة
6. اختم المذكرة بالطلبات بشكل واضح ومحدد

قم بصياغة المذكرة القانونية بناءً على المعلومات التالية:`;
  }

  return `You are an expert lawyer specializing in drafting legal memorandums in English.

DOCUMENT TYPE: ${docType.en}
WRITING STYLE: ${strengthStyle.en}

CRITICAL RULES - MUST FOLLOW:
1. NEVER cite laws, articles, statutes, or case references that are not provided in the input
2. NEVER fabricate or hallucinate legal citations, case numbers, or law references
3. Use ONLY the information provided - do not add content from other cases
4. Each memorandum is isolated - do not reference other documents or cases

DRAFTING GUIDELINES:
1. Use formal legal English appropriate for court submissions
2. Follow standard legal document structure
3. Provide logical legal analysis of the facts provided
4. Use established legal terminology and phrasing
5. Make arguments coherent and well-structured based on the given facts
6. Conclude with clear and specific requests/prayers
7. If legal references are needed, use general legal principles without citing specific non-existent sources

Draft the legal memorandum based on the following information:`;
}

function buildMemorandumUserPrompt(
  language: string,
  courtName: string,
  caseNumber: string,
  caseFacts: string,
  legalRequests: string,
  defensePoints?: string
): string {
  const isArabic = language === "ar";

  if (isArabic) {
    let prompt = `اسم المحكمة: ${courtName}
رقم القضية: ${caseNumber}

وقائع القضية:
${caseFacts}

الطلبات القانونية:
${legalRequests}`;

    if (defensePoints) {
      prompt += `

نقاط الدفاع:
${defensePoints}`;
    }

    return prompt;
  }

  let prompt = `Court Name: ${courtName}
Case Number: ${caseNumber}

Case Facts:
${caseFacts}

Legal Requests:
${legalRequests}`;

  if (defensePoints) {
    prompt += `

Defense Points:
${defensePoints}`;
  }

  return prompt;
}
