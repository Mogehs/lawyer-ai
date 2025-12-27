import { jsPDF } from "jspdf";
import { registerAmiriFont } from "./fonts/amiri-font";

interface ExportTranslationOptions {
  sourceText: string;
  translatedText: string;
  sourceLanguage: "ar" | "en";
  targetLanguage: "ar" | "en";
  documentType: string;
  purpose: string;
  tone: string;
  jurisdiction: string;
  isArabicUI: boolean;
}

interface ExportMemoOptions {
  content: string;
  memoType: string;
  courtName: string;
  caseNumber: string;
  language: "ar" | "en";
}

const memoTypeLabels: Record<string, { en: string; ar: string }> = {
  defense_memorandum: { en: "Defense Memorandum", ar: "مذكرة دفاع" },
  response_memorandum: { en: "Response Memorandum", ar: "مذكرة رد" },
  reply_memorandum: { en: "Reply Memorandum", ar: "مذكرة جوابية" },
  statement_of_claim: { en: "Statement of Claim", ar: "صحيفة دعوى" },
  appeal_memorandum: { en: "Appeal Memorandum", ar: "مذكرة استئناف" },
  legal_motion: { en: "Legal Motion", ar: "طلب قانوني" },
};

function wrapTextForPDF(
  doc: jsPDF,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  const paragraphs = text.split("\n");

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === "") {
      lines.push("");
      continue;
    }
    const splitLines = doc.splitTextToSize(paragraph, maxWidth);
    lines.push(...splitLines);
  }
  return lines;
}

function addPageNumbers(doc: jsPDF, pageWidth: number, pageHeight: number): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`${i} / ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: "center" });
  }
}

function addDisclaimer(doc: jsPDF, yPos: number, pageWidth: number, margin: number, isArabic: boolean): number {
  doc.setFontSize(9);
  doc.setTextColor(180, 0, 0);
  
  if (isArabic) {
    doc.setFont("Amiri", "normal");
    doc.text("مسودة - يتطلب مراجعة المحامي قبل الاستخدام", pageWidth - margin, yPos, { align: "right" });
    yPos += 5;
    doc.setFont("helvetica", "normal");
    doc.text("AI-Generated Draft - Requires Lawyer Review", pageWidth / 2, yPos, { align: "center" });
  } else {
    doc.setFont("helvetica", "normal");
    doc.text("AI-Generated Draft - Requires Lawyer Review Before Use", pageWidth / 2, yPos, { align: "center" });
  }
  
  doc.setTextColor(0);
  return yPos + 10;
}

export function exportTranslationToPDF(options: ExportTranslationOptions): void {
  const {
    sourceText,
    translatedText,
    sourceLanguage,
    targetLanguage,
    documentType,
    purpose,
    tone,
    jurisdiction,
    isArabicUI,
  } = options;

  const doc = new jsPDF();
  registerAmiriFont(doc);
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Legal Translation Document", pageWidth / 2, yPos, { align: "center" });
  yPos += 8;
  
  if (isArabicUI) {
    doc.setFont("Amiri", "normal");
    doc.setFontSize(14);
    doc.text("وثيقة ترجمة قانونية", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
  } else {
    yPos += 5;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated: ${dateStr}`, pageWidth / 2, yPos, { align: "center" });
  yPos += 8;

  yPos = addDisclaimer(doc, yPos, pageWidth, margin, isArabicUI);

  doc.setDrawColor(200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Document Settings:", margin, yPos);
  yPos += 7;

  doc.setFont("helvetica", "normal");
  const settings = [
    `Document Type: ${documentType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
    `Purpose: ${purpose.replace(/\b\w/g, (l) => l.toUpperCase())}`,
    `Tone: ${tone.replace(/\b\w/g, (l) => l.toUpperCase())}`,
    `Jurisdiction: ${jurisdiction.replace(/\b\w/g, (l) => l.toUpperCase())}`,
    `Direction: ${sourceLanguage === "ar" ? "Arabic to English" : "English to Arabic"}`,
  ];

  for (const setting of settings) {
    doc.text(setting, margin + 5, yPos);
    yPos += 6;
  }
  yPos += 10;

  doc.setDrawColor(200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const sourceLabel = sourceLanguage === "ar" ? "Source Text (Arabic):" : "Source Text (English):";
  doc.text(sourceLabel, margin, yPos);
  yPos += 8;

  const isSourceArabic = sourceLanguage === "ar";
  if (isSourceArabic) {
    doc.setFont("Amiri", "normal");
  } else {
    doc.setFont("helvetica", "normal");
  }
  doc.setFontSize(10);
  
  const sourceLines = wrapTextForPDF(doc, sourceText, contentWidth);
  
  for (const line of sourceLines) {
    if (yPos > pageHeight - margin - 20) {
      doc.addPage();
      yPos = margin;
    }
    if (isSourceArabic) {
      doc.text(line, pageWidth - margin, yPos, { align: "right" });
    } else {
      doc.text(line, margin, yPos);
    }
    yPos += 6;
  }
  yPos += 10;

  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = margin;
  }

  doc.setDrawColor(200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const targetLabel = targetLanguage === "ar" ? "Translated Text (Arabic):" : "Translated Text (English):";
  doc.text(targetLabel, margin, yPos);
  yPos += 8;

  const isTargetArabic = targetLanguage === "ar";
  if (isTargetArabic) {
    doc.setFont("Amiri", "normal");
  } else {
    doc.setFont("helvetica", "normal");
  }
  doc.setFontSize(10);
  
  const translatedLines = wrapTextForPDF(doc, translatedText, contentWidth);
  
  for (const line of translatedLines) {
    if (yPos > pageHeight - margin - 20) {
      doc.addPage();
      yPos = margin;
    }
    if (isTargetArabic) {
      doc.text(line, pageWidth - margin, yPos, { align: "right" });
    } else {
      doc.text(line, margin, yPos);
    }
    yPos += 6;
  }

  addPageNumbers(doc, pageWidth, pageHeight);

  const fileName = `legal_translation_${sourceLanguage}_to_${targetLanguage}_${Date.now()}.pdf`;
  doc.save(fileName);
}

export function exportMemoToPDF(options: ExportMemoOptions): void {
  const { content, memoType, courtName, caseNumber, language } = options;
  const isArabic = language === "ar";

  const doc = new jsPDF();
  registerAmiriFont(doc);
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  const typeLabel = memoTypeLabels[memoType] || { en: memoType, ar: memoType };

  if (isArabic) {
    doc.setFont("Amiri", "normal");
    doc.setFontSize(18);
    doc.text(typeLabel.ar, pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(typeLabel.en, pageWidth / 2, yPos, { align: "center" });
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(typeLabel.en, pageWidth / 2, yPos, { align: "center" });
  }
  yPos += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  
  const dateStr = new Date().toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });
  doc.text(`Date: ${dateStr}`, pageWidth / 2, yPos, { align: "center" });
  yPos += 8;

  yPos = addDisclaimer(doc, yPos, pageWidth, margin, isArabic);

  doc.setDrawColor(200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  doc.setTextColor(0);
  doc.setFontSize(10);
  
  if (isArabic) {
    doc.setFont("Amiri", "normal");
    doc.text("معلومات القضية:", pageWidth - margin, yPos, { align: "right" });
    yPos += 8;
    doc.text(`المحكمة: ${courtName}`, pageWidth - margin - 5, yPos, { align: "right" });
    yPos += 6;
    doc.text(`رقم القضية: ${caseNumber}`, pageWidth - margin - 5, yPos, { align: "right" });
    yPos += 6;
    doc.text("اللغة: العربية", pageWidth - margin - 5, yPos, { align: "right" });
  } else {
    doc.setFont("helvetica", "bold");
    doc.text("Case Information:", margin, yPos);
    yPos += 8;
    doc.setFont("helvetica", "normal");
    doc.text(`Court: ${courtName}`, margin + 5, yPos);
    yPos += 6;
    doc.text(`Case Number: ${caseNumber}`, margin + 5, yPos);
    yPos += 6;
    doc.text(`Language: English`, margin + 5, yPos);
  }
  yPos += 12;

  doc.setDrawColor(200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  if (isArabic) {
    doc.setFont("Amiri", "normal");
    doc.setFontSize(12);
    doc.text("نص المذكرة:", pageWidth - margin, yPos, { align: "right" });
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Memorandum Content:", margin, yPos);
  }
  yPos += 10;

  if (isArabic) {
    doc.setFont("Amiri", "normal");
  } else {
    doc.setFont("helvetica", "normal");
  }
  doc.setFontSize(10);
  
  const contentLines = wrapTextForPDF(doc, content, contentWidth);
  
  for (const line of contentLines) {
    if (yPos > pageHeight - margin - 20) {
      doc.addPage();
      yPos = margin;
      if (isArabic) {
        doc.setFont("Amiri", "normal");
      } else {
        doc.setFont("helvetica", "normal");
      }
      doc.setFontSize(10);
    }
    
    if (line.trim() === "") {
      yPos += 4;
      continue;
    }
    
    if (isArabic) {
      doc.text(line, pageWidth - margin, yPos, { align: "right" });
    } else {
      doc.text(line, margin, yPos);
    }
    yPos += 6;
  }

  yPos += 15;
  if (yPos > pageHeight - 40) {
    doc.addPage();
    yPos = margin;
  }

  doc.setDrawColor(200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  doc.setFontSize(8);
  doc.setTextColor(120);
  
  if (isArabic) {
    doc.setFont("Amiri", "normal");
    doc.text("هذه الوثيقة مسودة تم إنشاؤها بواسطة الذكاء الاصطناعي", pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
    doc.text("يجب مراجعتها من قبل محامٍ مؤهل قبل الاستخدام", pageWidth / 2, yPos, { align: "center" });
    yPos += 8;
  }
  
  doc.setFont("helvetica", "normal");
  doc.text("This document is an AI-generated draft.", pageWidth / 2, yPos, { align: "center" });
  yPos += 4;
  doc.text("It must be reviewed by a qualified lawyer before use.", pageWidth / 2, yPos, { align: "center" });

  addPageNumbers(doc, pageWidth, pageHeight);

  const sanitizedCaseNumber = caseNumber.replace(/[/\\:*?"<>|]/g, "-");
  const fileName = `memorandum_${sanitizedCaseNumber}_${Date.now()}.pdf`;
  doc.save(fileName);
}
