import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ar" | "en";
type Direction = "rtl" | "ltr";

interface I18nContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.title": "Legal AI System",
    "app.subtitle": "Translation & Memorandum Drafting",
    "nav.dashboard": "Dashboard",
    "nav.translation": "Translation",
    "nav.memorandum": "Memorandum",
    "nav.history": "History",
    "nav.settings": "Settings",
    "disclaimer.title": "AI-Generated Draft",
    "disclaimer.text": "Lawyer Review Required",
    "translation.title": "Legal Translation",
    "translation.source": "Source Text",
    "translation.target": "Translation",
    "translation.translate": "Translate",
    "translation.copy": "Copy",
    "translation.export": "Export",
    "translation.clear": "Clear",
    "translation.placeholder.source": "Enter or paste your legal text here...",
    "translation.placeholder.target": "Translation will appear here...",
    "translation.documentType": "Document Type",
    "translation.purpose": "Purpose",
    "translation.tone": "Tone",
    "translation.jurisdiction": "Jurisdiction",
    "translation.arToEn": "Arabic to English",
    "translation.enToAr": "English to Arabic",
    "docType.legal_memorandum": "Legal Memorandum",
    "docType.contract": "Contract",
    "docType.statement_of_claim": "Statement of Claim",
    "docType.court_judgment": "Court Judgment",
    "docType.legal_correspondence": "Legal Correspondence",
    "purpose.court": "Court",
    "purpose.internal": "Internal",
    "purpose.client": "Client",
    "tone.formal": "Formal",
    "tone.professional": "Professional",
    "tone.concise": "Concise",
    "jurisdiction.qatar": "Qatar",
    "jurisdiction.gcc": "GCC",
    "jurisdiction.neutral": "Neutral",
    "memo.title": "Legal Memorandum Drafting",
    "memo.type": "Memorandum Type",
    "memo.court": "Court Name",
    "memo.caseNumber": "Case Number",
    "memo.facts": "Case Facts",
    "memo.requests": "Legal Requests",
    "memo.defense": "Defense Points",
    "memo.strength": "Writing Strength",
    "memo.generate": "Generate Draft",
    "memo.regenerate": "Regenerate",
    "memo.edit": "Edit Draft",
    "memo.save": "Save Version",
    "memoType.defense_memorandum": "Defense Memorandum",
    "memoType.response_memorandum": "Response Memorandum",
    "memoType.reply_memorandum": "Reply Memorandum",
    "memoType.statement_of_claim": "Statement of Claim",
    "memoType.appeal_memorandum": "Appeal Memorandum",
    "memoType.legal_motion": "Legal Motion",
    "strength.strong": "Strong",
    "strength.neutral": "Neutral",
    "strength.defensive": "Defensive",
    "common.loading": "Loading...",
    "common.generating": "Generating...",
    "common.translating": "Translating...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.next": "Next",
    "common.back": "Back",
    "common.finish": "Finish",
    "export.title": "Export Document",
    "export.format": "Format",
    "export.download": "Download",
    "dashboard.welcome": "Welcome to Legal AI",
    "dashboard.recentTranslations": "Recent Translations",
    "dashboard.recentMemos": "Recent Memorandums",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.newTranslation": "New Translation",
    "dashboard.newMemo": "New Memorandum",
    "dashboard.stats.translations": "Translations",
    "dashboard.stats.memos": "Memorandums",
    "dashboard.stats.thisMonth": "This Month",
    "history.title": "Document History",
    "history.noItems": "No documents yet",
    "history.versions": "Versions",
    "step.type": "Select Type",
    "step.info": "Case Information",
    "step.generate": "Generate Draft",
    "step.review": "Review & Edit",
  },
  ar: {
    "app.title": "النظام القانوني الذكي",
    "app.subtitle": "الترجمة وصياغة المذكرات",
    "nav.dashboard": "الرئيسية",
    "nav.translation": "الترجمة",
    "nav.memorandum": "المذكرات",
    "nav.history": "السجل",
    "nav.settings": "الإعدادات",
    "disclaimer.title": "مسودة مولدة بالذكاء الاصطناعي",
    "disclaimer.text": "تتطلب مراجعة المحامي",
    "translation.title": "الترجمة القانونية",
    "translation.source": "النص المصدر",
    "translation.target": "الترجمة",
    "translation.translate": "ترجم",
    "translation.copy": "نسخ",
    "translation.export": "تصدير",
    "translation.clear": "مسح",
    "translation.placeholder.source": "أدخل أو الصق النص القانوني هنا...",
    "translation.placeholder.target": "ستظهر الترجمة هنا...",
    "translation.documentType": "نوع المستند",
    "translation.purpose": "الغرض",
    "translation.tone": "الأسلوب",
    "translation.jurisdiction": "الاختصاص القضائي",
    "translation.arToEn": "عربي إلى إنجليزي",
    "translation.enToAr": "إنجليزي إلى عربي",
    "docType.legal_memorandum": "مذكرة قانونية",
    "docType.contract": "عقد",
    "docType.statement_of_claim": "صحيفة دعوى",
    "docType.court_judgment": "حكم محكمة",
    "docType.legal_correspondence": "مراسلات قانونية",
    "purpose.court": "محكمة",
    "purpose.internal": "داخلي",
    "purpose.client": "عميل",
    "tone.formal": "رسمي",
    "tone.professional": "مهني",
    "tone.concise": "موجز",
    "jurisdiction.qatar": "قطر",
    "jurisdiction.gcc": "دول الخليج",
    "jurisdiction.neutral": "محايد",
    "memo.title": "صياغة المذكرات القانونية",
    "memo.type": "نوع المذكرة",
    "memo.court": "اسم المحكمة",
    "memo.caseNumber": "رقم القضية",
    "memo.facts": "وقائع القضية",
    "memo.requests": "الطلبات القانونية",
    "memo.defense": "نقاط الدفاع",
    "memo.strength": "قوة الصياغة",
    "memo.generate": "إنشاء المسودة",
    "memo.regenerate": "إعادة الإنشاء",
    "memo.edit": "تحرير المسودة",
    "memo.save": "حفظ النسخة",
    "memoType.defense_memorandum": "مذكرة دفاع",
    "memoType.response_memorandum": "مذكرة رد",
    "memoType.reply_memorandum": "مذكرة جوابية",
    "memoType.statement_of_claim": "صحيفة دعوى",
    "memoType.appeal_memorandum": "مذكرة استئناف",
    "memoType.legal_motion": "طلب قانوني",
    "strength.strong": "قوي",
    "strength.neutral": "محايد",
    "strength.defensive": "دفاعي",
    "common.loading": "جاري التحميل...",
    "common.generating": "جاري الإنشاء...",
    "common.translating": "جاري الترجمة...",
    "common.error": "حدث خطأ",
    "common.success": "نجاح",
    "common.cancel": "إلغاء",
    "common.save": "حفظ",
    "common.delete": "حذف",
    "common.next": "التالي",
    "common.back": "السابق",
    "common.finish": "إنهاء",
    "export.title": "تصدير المستند",
    "export.format": "الصيغة",
    "export.download": "تحميل",
    "dashboard.welcome": "مرحباً بك في النظام القانوني الذكي",
    "dashboard.recentTranslations": "الترجمات الأخيرة",
    "dashboard.recentMemos": "المذكرات الأخيرة",
    "dashboard.quickActions": "إجراءات سريعة",
    "dashboard.newTranslation": "ترجمة جديدة",
    "dashboard.newMemo": "مذكرة جديدة",
    "dashboard.stats.translations": "الترجمات",
    "dashboard.stats.memos": "المذكرات",
    "dashboard.stats.thisMonth": "هذا الشهر",
    "history.title": "سجل المستندات",
    "history.noItems": "لا توجد مستندات بعد",
    "history.versions": "النسخ",
    "step.type": "اختر النوع",
    "step.info": "معلومات القضية",
    "step.generate": "إنشاء المسودة",
    "step.review": "المراجعة والتحرير",
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved === "ar" || saved === "en") ? saved : "ar";
  });

  const direction: Direction = language === "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.body.style.fontFamily = language === "ar" 
      ? "var(--font-arabic), sans-serif" 
      : "var(--font-sans), sans-serif";
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, direction, setLanguage, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
