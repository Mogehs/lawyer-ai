import { useState } from "react";
import { FileText, Loader2, ChevronRight, ChevronLeft, RotateCcw, Download, Copy, Check, Sparkles, Shield, MessageSquare, CornerUpLeft, ArrowUp, Gavel, FileSignature } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { memorandumTypes, memoStrengths } from "@shared/schema";

const memoTypeIcons: Record<string, any> = {
  defense_memorandum: Shield,
  response_memorandum: MessageSquare,
  reply_memorandum: CornerUpLeft,
  statement_of_claim: FileText,
  appeal_memorandum: ArrowUp,
  legal_motion: Gavel,
};

const memoTypeColors: Record<string, string> = {
  defense_memorandum: "from-blue-500/20 to-blue-600/20 text-blue-600 dark:text-blue-400",
  response_memorandum: "from-emerald-500/20 to-emerald-600/20 text-emerald-600 dark:text-emerald-400",
  reply_memorandum: "from-purple-500/20 to-purple-600/20 text-purple-600 dark:text-purple-400",
  statement_of_claim: "from-amber-500/20 to-amber-600/20 text-amber-600 dark:text-amber-400",
  appeal_memorandum: "from-rose-500/20 to-rose-600/20 text-rose-600 dark:text-rose-400",
  legal_motion: "from-indigo-500/20 to-indigo-600/20 text-indigo-600 dark:text-indigo-400",
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
    <div className="p-6 lg:p-8 h-full flex flex-col max-w-7xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
            <FileSignature className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-memo-title">
              {t("memo.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {memoType ? t(`memoType.${memoType}`) : t("step.type")}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={resetForm} data-testid="button-reset-memo">
          <RotateCcw className="h-4 w-4" />
          <span className={isRTL ? "mr-2" : "ml-2"}>{t("translation.clear")}</span>
        </Button>
      </div>

      <div className="flex items-center gap-1 mb-8 p-1 bg-muted/50 rounded-xl overflow-x-auto">
        {steps.map((s, i) => (
          <div key={s.number} className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => {
                if (s.number < step) setStep(s.number);
              }}
              disabled={s.number > step}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                step === s.number
                  ? "bg-background shadow-sm text-foreground"
                  : step > s.number
                  ? "text-muted-foreground hover:text-foreground cursor-pointer"
                  : "text-muted-foreground/50 cursor-not-allowed"
              }`}
              data-testid={`step-indicator-${s.number}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === s.number
                  ? "bg-primary text-primary-foreground"
                  : step > s.number
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}>
                {s.number}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && (
              <ChevronNext className="h-4 w-4 text-muted-foreground/50 shrink-0" />
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {memorandumTypes.map((type) => {
              const Icon = memoTypeIcons[type] || FileText;
              const colorClass = memoTypeColors[type] || "from-gray-500/20 to-gray-600/20 text-gray-600";
              return (
                <Card
                  key={type}
                  className={`cursor-pointer transition-all duration-200 border-0 shadow-md hover-elevate ${
                    memoType === type ? "ring-2 ring-primary shadow-lg" : ""
                  }`}
                  onClick={() => setMemoType(type)}
                  data-testid={`card-memo-type-${type}`}
                >
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass.split(' ').slice(0, 2).join(' ')} flex items-center justify-center mb-3`}>
                      <Icon className={`h-6 w-6 ${colorClass.split(' ').slice(2).join(' ')}`} />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      {t(`memoType.${type}`)}
                    </CardTitle>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className="max-w-3xl space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{isRTL ? "معلومات القضية" : "Case Information"}</CardTitle>
                <CardDescription>
                  {isRTL ? "أدخل المعلومات الأساسية للقضية" : "Enter the basic case information"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{isRTL ? "تفاصيل القضية" : "Case Details"}</CardTitle>
                <CardDescription>
                  {isRTL ? "أدخل وقائع القضية والطلبات القانونية" : "Enter case facts and legal requests"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="defensePoints" className="flex items-center gap-2">
                    {t("memo.defense")}
                    <Badge variant="secondary" className="text-xs">{isRTL ? "اختياري" : "Optional"}</Badge>
                  </Label>
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
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {t("memo.strength")}
                </CardTitle>
                <CardDescription>
                  {language === "ar" 
                    ? "اختر قوة الصياغة القانونية للمذكرة"
                    : "Choose the writing strength for your memorandum"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-emerald-600 dark:text-emerald-400">{t("strength.strong")}</span>
                    <span className="text-muted-foreground">{t("strength.neutral")}</span>
                    <span className="text-amber-600 dark:text-amber-400">{t("strength.defensive")}</span>
                  </div>
                  <Slider
                    value={[strengthIndex]}
                    onValueChange={([val]) => setStrengthIndex(val)}
                    min={0}
                    max={2}
                    step={1}
                    className="py-2"
                    data-testid="slider-strength"
                  />
                  <div className="text-center">
                    <Badge variant="secondary" className="text-base px-4 py-1.5">
                      {t(`strength.${strengthValue}`)}
                    </Badge>
                  </div>
                </div>

                <div className="pt-6 border-t space-y-4">
                  <h4 className="font-semibold">{language === "ar" ? "ملخص المعلومات" : "Summary"}</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">{t("memo.type")}</span>
                      <span className="text-sm font-medium">{t(`memoType.${memoType}`)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">{t("memo.court")}</span>
                      <span className="text-sm font-medium">{courtName}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">{t("memo.caseNumber")}</span>
                      <span className="text-sm font-medium font-mono">{caseNumber}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap border-b">
                <div>
                  <CardTitle className="text-lg">{t(`memoType.${memoType}`)}</CardTitle>
                  <CardDescription className="font-mono">{courtName} - {caseNumber}</CardDescription>
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
              <CardContent className="p-6">
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[400px] text-base leading-relaxed border-0 shadow-none focus-visible:ring-0"
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
          size="lg"
          data-testid="button-back"
        >
          <ChevronBack className="h-4 w-4" />
          <span className={isRTL ? "mr-2" : "ml-2"}>{t("common.back")}</span>
        </Button>

        {step < 3 && (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
            size="lg"
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
            size="lg"
            className="gap-2"
            data-testid="button-generate"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("common.generating")}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {t("memo.generate")}
              </>
            )}
          </Button>
        )}

        {step === 4 && (
          <Button
            size="lg"
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
