import { useState } from "react";
import { ArrowLeftRight, Copy, Download, Loader2, Check, RotateCcw } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { documentTypes, documentPurposes, writingTones, jurisdictions } from "@shared/schema";

export default function Translation() {
  const { t, isRTL, language } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState<"ar" | "en">(language === "ar" ? "ar" : "en");
  const [documentType, setDocumentType] = useState<string>("legal_memorandum");
  const [purpose, setPurpose] = useState<string>("court");
  const [tone, setTone] = useState<string>("formal");
  const [jurisdiction, setJurisdiction] = useState<string>("qatar");
  const [copied, setCopied] = useState(false);

  const targetLanguage = sourceLanguage === "ar" ? "en" : "ar";

  const translateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/translate", {
        sourceText,
        sourceLanguage,
        targetLanguage,
        documentType,
        purpose,
        tone,
        jurisdiction,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setTranslatedText(data.translatedText);
      queryClient.invalidateQueries({ queryKey: ["/api/translations"] });
      toast({
        title: t("common.success"),
        description: t("translation.title"),
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        variant: "destructive",
      });
    },
  });

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setSourceText(translatedText);
    setTranslatedText("");
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setSourceText("");
    setTranslatedText("");
  };

  return (
    <div className="p-6 h-full flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-translation-title">
            {t("translation.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sourceLanguage === "ar" ? t("translation.arToEn") : t("translation.enToAr")}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={swapLanguages}
            disabled={!translatedText}
            data-testid="button-swap-languages"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            disabled={!sourceText && !translatedText}
            data-testid="button-clear"
          >
            <RotateCcw className="h-4 w-4" />
            <span className={isRTL ? "mr-2" : "ml-2"}>{t("translation.clear")}</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 mb-6">
        <div className="space-y-2">
          <Label>{t("translation.documentType")}</Label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger data-testid="select-document-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`docType.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("translation.purpose")}</Label>
          <Select value={purpose} onValueChange={setPurpose}>
            <SelectTrigger data-testid="select-purpose">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {documentPurposes.map((p) => (
                <SelectItem key={p} value={p}>
                  {t(`purpose.${p}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("translation.tone")}</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger data-testid="select-tone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {writingTones.map((t_) => (
                <SelectItem key={t_} value={t_}>
                  {t(`tone.${t_}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("translation.jurisdiction")}</Label>
          <Select value={jurisdiction} onValueChange={setJurisdiction}>
            <SelectTrigger data-testid="select-jurisdiction">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {jurisdictions.map((j) => (
                <SelectItem key={j} value={j}>
                  {t(`jurisdiction.${j}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 grid gap-4 lg:grid-cols-2 min-h-0">
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {t("translation.source")}
              <span className="text-xs text-muted-foreground font-normal">
                ({sourceLanguage === "ar" ? "العربية" : "English"})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={t("translation.placeholder.source")}
              className="flex-1 min-h-[200px] resize-none text-base leading-relaxed"
              dir={sourceLanguage === "ar" ? "rtl" : "ltr"}
              style={{ fontFamily: sourceLanguage === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
              data-testid="textarea-source"
            />
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => translateMutation.mutate()}
                disabled={!sourceText.trim() || translateMutation.isPending}
                data-testid="button-translate"
              >
                {translateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className={isRTL ? "mr-2" : "ml-2"}>{t("common.translating")}</span>
                  </>
                ) : (
                  t("translation.translate")
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {t("translation.target")}
              <span className="text-xs text-muted-foreground font-normal">
                ({targetLanguage === "ar" ? "العربية" : "English"})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <Textarea
              value={translatedText}
              onChange={(e) => setTranslatedText(e.target.value)}
              placeholder={t("translation.placeholder.target")}
              className="flex-1 min-h-[200px] resize-none text-base leading-relaxed"
              dir={targetLanguage === "ar" ? "rtl" : "ltr"}
              style={{ fontFamily: targetLanguage === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
              data-testid="textarea-target"
            />
            <div className="mt-4 flex gap-2 justify-end flex-wrap">
              <Button
                variant="outline"
                onClick={copyToClipboard}
                disabled={!translatedText}
                data-testid="button-copy"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className={isRTL ? "mr-2" : "ml-2"}>{t("translation.copy")}</span>
              </Button>
              <Button
                variant="outline"
                disabled={!translatedText}
                data-testid="button-export"
              >
                <Download className="h-4 w-4" />
                <span className={isRTL ? "mr-2" : "ml-2"}>{t("translation.export")}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
