import { useState } from "react";
import { FileText, Loader2, ChevronRight, ChevronLeft, RotateCcw, Download, Copy, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { memorandumTypes, memoStrengths } from "@shared/schema";

const memoTypeIcons: Record<string, string> = {
  defense_memorandum: "shield",
  response_memorandum: "reply",
  reply_memorandum: "corner-up-left",
  statement_of_claim: "file-text",
  appeal_memorandum: "arrow-up",
  legal_motion: "gavel",
};

export default function Memorandum() {
  const { t, isRTL, language } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [memoType, setMemoType] = useState<string>("");
  const [courtName, setCourtName] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [caseFacts, setCaseFacts] = useState("");
  const [legalRequests, setLegalRequests] = useState("");
  const [defensePoints, setDefensePoints] = useState("");
  const [strengthIndex, setStrengthIndex] = useState(1);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);

  const strengthValue = memoStrengths[strengthIndex];
  const ChevronNext = isRTL ? ChevronLeft : ChevronRight;
  const ChevronBack = isRTL ? ChevronRight : ChevronLeft;

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/memorandums/generate", {
        type: memoType,
        language,
        courtName,
        caseNumber,
        caseFacts,
        legalRequests,
        defensePoints,
        strength: strengthValue,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data.generatedContent);
      setStep(4);
      queryClient.invalidateQueries({ queryKey: ["/api/memorandums"] });
      toast({
        title: t("common.success"),
        description: t("memo.title"),
      });
    },
    onError: () => {
      toast({
        title: t("common.error"),
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setStep(1);
    setMemoType("");
    setCourtName("");
    setCaseNumber("");
    setCaseFacts("");
    setLegalRequests("");
    setDefensePoints("");
    setStrengthIndex(1);
    setGeneratedContent("");
  };

  const canProceedStep1 = memoType !== "";
  const canProceedStep2 = courtName && caseNumber && caseFacts && legalRequests;

  const steps = [
    { number: 1, label: t("step.type") },
    { number: 2, label: t("step.info") },
    { number: 3, label: t("step.generate") },
    { number: 4, label: t("step.review") },
  ];

  return (
    <div className="p-6 h-full flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-memo-title">
            {t("memo.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {memoType ? t(`memoType.${memoType}`) : t("step.type")}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetForm} data-testid="button-reset-memo">
          <RotateCcw className="h-4 w-4" />
          <span className={isRTL ? "mr-2" : "ml-2"}>{t("translation.clear")}</span>
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.number} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                step === s.number
                  ? "bg-primary text-primary-foreground"
                  : step > s.number
                  ? "bg-muted text-muted-foreground"
                  : "bg-muted/50 text-muted-foreground"
              }`}
              data-testid={`step-indicator-${s.number}`}
            >
              <span className="font-medium">{s.number}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <ChevronNext className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {memorandumTypes.map((type) => (
              <Card
                key={type}
                className={`cursor-pointer transition-colors hover-elevate ${
                  memoType === type ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setMemoType(type)}
                data-testid={`card-memo-type-${type}`}
              >
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {t(`memoType.${type}`)}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="max-w-3xl space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="courtName">{t("memo.court")}</Label>
                <Input
                  id="courtName"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  placeholder={language === "ar" ? "مثال: المحكمة الابتدائية" : "e.g., Civil Court of First Instance"}
                  dir={language === "ar" ? "rtl" : "ltr"}
                  data-testid="input-court-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caseNumber">{t("memo.caseNumber")}</Label>
                <Input
                  id="caseNumber"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  placeholder={language === "ar" ? "مثال: 123/2024" : "e.g., 123/2024"}
                  className="font-mono"
                  data-testid="input-case-number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caseFacts">{t("memo.facts")}</Label>
              <Textarea
                id="caseFacts"
                value={caseFacts}
                onChange={(e) => setCaseFacts(e.target.value)}
                placeholder={language === "ar" ? "أدخل وقائع القضية بالتفصيل..." : "Enter the case facts in detail..."}
                className="min-h-[150px]"
                dir={language === "ar" ? "rtl" : "ltr"}
                data-testid="textarea-case-facts"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalRequests">{t("memo.requests")}</Label>
              <Textarea
                id="legalRequests"
                value={legalRequests}
                onChange={(e) => setLegalRequests(e.target.value)}
                placeholder={language === "ar" ? "أدخل الطلبات القانونية..." : "Enter the legal requests..."}
                className="min-h-[100px]"
                dir={language === "ar" ? "rtl" : "ltr"}
                data-testid="textarea-legal-requests"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defensePoints">{t("memo.defense")}</Label>
              <Textarea
                id="defensePoints"
                value={defensePoints}
                onChange={(e) => setDefensePoints(e.target.value)}
                placeholder={language === "ar" ? "أدخل نقاط الدفاع (اختياري)..." : "Enter defense points (optional)..."}
                className="min-h-[100px]"
                dir={language === "ar" ? "rtl" : "ltr"}
                data-testid="textarea-defense-points"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>{t("memo.strength")}</CardTitle>
                <CardDescription>
                  {language === "ar" 
                    ? "اختر قوة الصياغة القانونية للمذكرة"
                    : "Choose the writing strength for your memorandum"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t("strength.strong")}</span>
                    <span>{t("strength.neutral")}</span>
                    <span>{t("strength.defensive")}</span>
                  </div>
                  <Slider
                    value={[strengthIndex]}
                    onValueChange={([val]) => setStrengthIndex(val)}
                    min={0}
                    max={2}
                    step={1}
                    data-testid="slider-strength"
                  />
                  <p className="text-center text-lg font-medium text-primary">
                    {t(`strength.${strengthValue}`)}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">{language === "ar" ? "ملخص المعلومات" : "Summary"}</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>{t("memo.type")}:</strong> {t(`memoType.${memoType}`)}</p>
                    <p><strong>{t("memo.court")}:</strong> {courtName}</p>
                    <p><strong>{t("memo.caseNumber")}:</strong> {caseNumber}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                <div>
                  <CardTitle>{t(`memoType.${memoType}`)}</CardTitle>
                  <CardDescription>{courtName} - {caseNumber}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    data-testid="button-copy-memo"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    <span className={isRTL ? "mr-2" : "ml-2"}>{t("translation.copy")}</span>
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-export-memo">
                    <Download className="h-4 w-4" />
                    <span className={isRTL ? "mr-2" : "ml-2"}>{t("translation.export")}</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[400px] text-base leading-relaxed"
                  dir={language === "ar" ? "rtl" : "ltr"}
                  style={{ fontFamily: language === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
                  data-testid="textarea-generated-content"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4 mt-6 pt-4 border-t flex-wrap">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          data-testid="button-back"
        >
          <ChevronBack className="h-4 w-4" />
          <span className={isRTL ? "mr-2" : "ml-2"}>{t("common.back")}</span>
        </Button>

        {step < 3 && (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
            data-testid="button-next"
          >
            <span className={isRTL ? "ml-2" : "mr-2"}>{t("common.next")}</span>
            <ChevronNext className="h-4 w-4" />
          </Button>
        )}

        {step === 3 && (
          <Button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            data-testid="button-generate"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className={isRTL ? "mr-2" : "ml-2"}>{t("common.generating")}</span>
              </>
            ) : (
              t("memo.generate")
            )}
          </Button>
        )}

        {step === 4 && (
          <Button
            onClick={() => {
              toast({
                title: t("common.success"),
                description: t("memo.save"),
              });
            }}
            data-testid="button-save-version"
          >
            {t("memo.save")}
          </Button>
        )}
      </div>
    </div>
  );
}
