import type { Translation, InsertTranslation, Memorandum, InsertMemorandum } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getTranslations(): Promise<Translation[]>;
  getTranslation(id: string): Promise<Translation | undefined>;
  createTranslation(data: InsertTranslation & { translatedText: string }): Promise<Translation>;
  deleteTranslation(id: string): Promise<void>;
  addTranslationVersion(id: string, translatedText: string): Promise<Translation | undefined>;

  getMemorandums(): Promise<Memorandum[]>;
  getMemorandum(id: string): Promise<Memorandum | undefined>;
  createMemorandum(data: InsertMemorandum & { generatedContent: string }): Promise<Memorandum>;
  deleteMemorandum(id: string): Promise<void>;
  addMemorandumVersion(id: string, content: string): Promise<Memorandum | undefined>;
}

export class MemStorage implements IStorage {
  private translations: Map<string, Translation>;
  private memorandums: Map<string, Memorandum>;

  constructor() {
    this.translations = new Map();
    this.memorandums = new Map();
  }

  async getTranslations(): Promise<Translation[]> {
    return Array.from(this.translations.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTranslation(id: string): Promise<Translation | undefined> {
    return this.translations.get(id);
  }

  async createTranslation(data: InsertTranslation & { translatedText: string }): Promise<Translation> {
    const id = randomUUID();
    const translation: Translation = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
      versions: [],
    };
    this.translations.set(id, translation);
    return translation;
  }

  async deleteTranslation(id: string): Promise<void> {
    this.translations.delete(id);
  }

  async addTranslationVersion(id: string, translatedText: string): Promise<Translation | undefined> {
    const translation = this.translations.get(id);
    if (!translation) return undefined;

    translation.versions.push({
      id: randomUUID(),
      translatedText,
      createdAt: new Date().toISOString(),
    });
    translation.translatedText = translatedText;
    return translation;
  }

  async getMemorandums(): Promise<Memorandum[]> {
    return Array.from(this.memorandums.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getMemorandum(id: string): Promise<Memorandum | undefined> {
    return this.memorandums.get(id);
  }

  async createMemorandum(data: InsertMemorandum & { generatedContent: string }): Promise<Memorandum> {
    const id = randomUUID();
    const memorandum: Memorandum = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
      versions: [],
    };
    this.memorandums.set(id, memorandum);
    return memorandum;
  }

  async deleteMemorandum(id: string): Promise<void> {
    this.memorandums.delete(id);
  }

  async addMemorandumVersion(id: string, content: string): Promise<Memorandum | undefined> {
    const memorandum = this.memorandums.get(id);
    if (!memorandum) return undefined;

    memorandum.versions.push({
      id: randomUUID(),
      content,
      createdAt: new Date().toISOString(),
    });
    memorandum.generatedContent = content;
    return memorandum;
  }
}

export const storage = new MemStorage();
