import { 
  translations, 
  translationVersions, 
  memorandums, 
  memorandumVersions,
  type Translation, 
  type InsertTranslation, 
  type Memorandum, 
  type InsertMemorandum 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getTranslations(userId: string): Promise<Translation[]>;
  getTranslation(id: string): Promise<Translation | undefined>;
  createTranslation(data: InsertTranslation): Promise<Translation>;
  deleteTranslation(id: string): Promise<void>;
  addTranslationVersion(id: string, translatedText: string): Promise<Translation | undefined>;

  getMemorandums(userId: string): Promise<Memorandum[]>;
  getMemorandum(id: string): Promise<Memorandum | undefined>;
  createMemorandum(data: InsertMemorandum): Promise<Memorandum>;
  deleteMemorandum(id: string): Promise<void>;
  addMemorandumVersion(id: string, content: string): Promise<Memorandum | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getTranslations(userId: string): Promise<Translation[]> {
    const results = await db
      .select()
      .from(translations)
      .where(eq(translations.userId, userId))
      .orderBy(desc(translations.createdAt));
    
    const translationsWithVersions = await Promise.all(
      results.map(async (t) => {
        const versions = await db
          .select()
          .from(translationVersions)
          .where(eq(translationVersions.translationId, t.id))
          .orderBy(desc(translationVersions.createdAt));
        return { ...t, versions };
      })
    );
    
    return translationsWithVersions;
  }

  async getTranslation(id: string): Promise<Translation | undefined> {
    const [result] = await db
      .select()
      .from(translations)
      .where(eq(translations.id, id));
    
    if (!result) return undefined;
    
    const versions = await db
      .select()
      .from(translationVersions)
      .where(eq(translationVersions.translationId, id))
      .orderBy(desc(translationVersions.createdAt));
    
    return { ...result, versions };
  }

  async createTranslation(data: InsertTranslation): Promise<Translation> {
    const [result] = await db
      .insert(translations)
      .values(data)
      .returning();
    
    return { ...result, versions: [] };
  }

  async deleteTranslation(id: string): Promise<void> {
    await db.delete(translationVersions).where(eq(translationVersions.translationId, id));
    await db.delete(translations).where(eq(translations.id, id));
  }

  async addTranslationVersion(id: string, translatedText: string): Promise<Translation | undefined> {
    const translation = await this.getTranslation(id);
    if (!translation) return undefined;

    await db.insert(translationVersions).values({
      translationId: id,
      translatedText,
    });

    await db
      .update(translations)
      .set({ translatedText })
      .where(eq(translations.id, id));

    return this.getTranslation(id);
  }

  async getMemorandums(userId: string): Promise<Memorandum[]> {
    const results = await db
      .select()
      .from(memorandums)
      .where(eq(memorandums.userId, userId))
      .orderBy(desc(memorandums.createdAt));
    
    const memorandumsWithVersions = await Promise.all(
      results.map(async (m) => {
        const versions = await db
          .select()
          .from(memorandumVersions)
          .where(eq(memorandumVersions.memorandumId, m.id))
          .orderBy(desc(memorandumVersions.createdAt));
        return { ...m, versions };
      })
    );
    
    return memorandumsWithVersions;
  }

  async getMemorandum(id: string): Promise<Memorandum | undefined> {
    const [result] = await db
      .select()
      .from(memorandums)
      .where(eq(memorandums.id, id));
    
    if (!result) return undefined;
    
    const versions = await db
      .select()
      .from(memorandumVersions)
      .where(eq(memorandumVersions.memorandumId, id))
      .orderBy(desc(memorandumVersions.createdAt));
    
    return { ...result, versions };
  }

  async createMemorandum(data: InsertMemorandum): Promise<Memorandum> {
    const [result] = await db
      .insert(memorandums)
      .values(data)
      .returning();
    
    return { ...result, versions: [] };
  }

  async deleteMemorandum(id: string): Promise<void> {
    await db.delete(memorandumVersions).where(eq(memorandumVersions.memorandumId, id));
    await db.delete(memorandums).where(eq(memorandums.id, id));
  }

  async addMemorandumVersion(id: string, content: string): Promise<Memorandum | undefined> {
    const memorandum = await this.getMemorandum(id);
    if (!memorandum) return undefined;

    await db.insert(memorandumVersions).values({
      memorandumId: id,
      content,
    });

    await db
      .update(memorandums)
      .set({ generatedContent: content })
      .where(eq(memorandums.id, id));

    return this.getMemorandum(id);
  }
}

export const storage = new DatabaseStorage();
