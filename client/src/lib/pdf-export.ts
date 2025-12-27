import { jsPDF } from "jspdf";

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

function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const avgCharWidth = fontSize * 0.5;
  const charsPerLine = Math.floor(maxWidth / avgCharWidth);
  const lines: string[] = [];
  const paragraphs = text.split("\n");

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === "") {
      lines.push("");
      continue;
    }
    let remaining = paragraph;
    while (remaining.length > 0) {
      if (remaining.length <= charsPerLine) {
        lines.push(remaining);
        break;
      }
      let breakPoint = remaining.lastIndexOf(" ", charsPerLine);
      if (breakPoint === -1 || breakPoint < charsPerLine * 0.5) {
        breakPoint = charsPerLine;
      }
      lines.push(remaining.substring(0, breakPoint).trim());
      remaining = remaining.substring(breakPoint).trim();
    }
  }
  return lines;
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
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const title = isArabicUI ? "Legal Translation Document" : "Legal Translation Document";
  doc.text(title, pageWidth / 2, yPos, { align: "center" });
  yPos += 15;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated: ${dateStr}`, pageWidth / 2, yPos, { align: "center" });
  yPos += 5;

  doc.setTextColor(100);
  doc.text("AI-Generated - Requires Lawyer Review Before Use", pageWidth / 2, yPos, { align: "center" });
  yPos += 15;

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
    `Translation: ${sourceLanguage === "ar" ? "Arabic → English" : "English → Arabic"}`,
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
  doc.setFontSize(12);
  doc.text(`Source Text (${sourceLanguage === "ar" ? "Arabic" : "English"}):`, margin, yPos);
  yPos += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const sourceLines = wrapText(sourceText, contentWidth, 10);
  for (const line of sourceLines) {
    if (yPos > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
    doc.text(line, margin, yPos);
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
  doc.setFontSize(12);
  doc.text(`Translated Text (${targetLanguage === "ar" ? "Arabic" : "English"}):`, margin, yPos);
  yPos += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const translatedLines = wrapText(translatedText, contentWidth, 10);
  for (const line of translatedLines) {
    if (yPos > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
    doc.text(line, margin, yPos);
    yPos += 6;
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: "center" });
  }

  const fileName = `translation_${sourceLanguage}_to_${targetLanguage}_${Date.now()}.pdf`;
  doc.save(fileName);
}

export function exportMemoToPDF(options: ExportMemoOptions): void {
  const { content, memoType, courtName, caseNumber, language } = options;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const title = memoType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  doc.text(title, pageWidth / 2, yPos, { align: "center" });
  yPos += 15;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated: ${dateStr}`, pageWidth / 2, yPos, { align: "center" });
  yPos += 5;

  doc.setTextColor(100);
  doc.text("AI-Generated - Requires Lawyer Review Before Use", pageWidth / 2, yPos, { align: "center" });
  yPos += 15;

  doc.setDrawColor(200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Case Information:", margin, yPos);
  yPos += 7;

  doc.setFont("helvetica", "normal");
  doc.text(`Court: ${courtName}`, margin + 5, yPos);
  yPos += 6;
  doc.text(`Case Number: ${caseNumber}`, margin + 5, yPos);
  yPos += 6;
  doc.text(`Language: ${language === "ar" ? "Arabic" : "English"}`, margin + 5, yPos);
  yPos += 15;

  doc.setDrawColor(200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Memorandum Content:", margin, yPos);
  yPos += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const contentLines = wrapText(content, contentWidth, 10);
  for (const line of contentLines) {
    if (yPos > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
    doc.text(line, margin, yPos);
    yPos += 6;
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: "center" });
  }

  const fileName = `${memoType}_${caseNumber.replace(/\//g, "-")}_${Date.now()}.pdf`;
  doc.save(fileName);
}
