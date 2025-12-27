import { useState } from "react";
import { Languages, FileText, Clock, ChevronRight, ChevronLeft, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Translation, Memorandum } from "@shared/schema";

export default function History() {
  const { t, isRTL, language } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("translations");
  const [selectedItem, setSelectedItem] = useState<Translation | Memorandum | null>(null);

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  const { data: translations, isLoading: loadingTranslations } = useQuery<Translation[]>({
    queryKey: ["/api/translations"],
  });

  const { data: memorandums, isLoading: loadingMemos } = useQuery<Memorandum[]>({
    queryKey: ["/api/memorandums"],
  });

  const deleteTranslationMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/translations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translations"] });
      setSelectedItem(null);
      toast({ title: t("common.success") });
    },
  });

  const deleteMemoMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/memorandums/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorandums"] });
      setSelectedItem(null);
      toast({ title: t("common.success") });
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === "ar" ? "ar-QA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isLoading = loadingTranslations || loadingMemos;

  return (
    <div className="p-6 h-full flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground" data-testid="text-history-title">
          {t("history.title")}
        </h1>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
          <TabsTrigger value="translations" className="gap-2" data-testid="tab-translations">
            <Languages className="h-4 w-4" />
            {t("nav.translation")}
          </TabsTrigger>
          <TabsTrigger value="memorandums" className="gap-2" data-testid="tab-memorandums">
            <FileText className="h-4 w-4" />
            {t("nav.memorandum")}
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 grid gap-4 lg:grid-cols-2 min-h-0">
          <TabsContent value="translations" className="mt-0 h-full">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  {t("dashboard.recentTranslations")}
                  {translations && (
                    <Badge variant="secondary" className="text-xs">
                      {translations.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                <ScrollArea className="h-full pr-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : !translations?.length ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Languages className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>{t("history.noItems")}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {translations.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-md cursor-pointer transition-colors hover-elevate ${
                            selectedItem?.id === item.id && selectedTab === "translations"
                              ? "bg-muted"
                              : "bg-muted/30"
                          }`}
                          onClick={() => setSelectedItem(item)}
                          data-testid={`item-translation-${item.id}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm line-clamp-2 flex-1">
                              {item.sourceText.substring(0, 80)}...
                            </p>
                            <ChevronIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {item.sourceLanguage === "ar" ? "AR → EN" : "EN → AR"}
                            </Badge>
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memorandums" className="mt-0 h-full">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t("dashboard.recentMemos")}
                  {memorandums && (
                    <Badge variant="secondary" className="text-xs">
                      {memorandums.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                <ScrollArea className="h-full pr-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : !memorandums?.length ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p>{t("history.noItems")}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {memorandums.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3 rounded-md cursor-pointer transition-colors hover-elevate ${
                            selectedItem?.id === item.id && selectedTab === "memorandums"
                              ? "bg-muted"
                              : "bg-muted/30"
                          }`}
                          onClick={() => setSelectedItem(item)}
                          data-testid={`item-memo-${item.id}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {t(`memoType.${item.type}`)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.courtName} - {item.caseNumber}
                              </p>
                            </div>
                            <ChevronIcon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {t(`strength.${item.strength}`)}
                            </Badge>
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <Card className="h-full flex flex-col lg:row-start-1 lg:col-start-2 lg:row-span-2">
            <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-sm font-medium">
                {language === "ar" ? "التفاصيل" : "Details"}
              </CardTitle>
              {selectedItem && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if ("sourceText" in selectedItem) {
                      deleteTranslationMutation.mutate(selectedItem.id);
                    } else {
                      deleteMemoMutation.mutate(selectedItem.id);
                    }
                  }}
                  data-testid="button-delete-item"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              {!selectedItem ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">
                    {language === "ar" ? "اختر عنصراً لعرض التفاصيل" : "Select an item to view details"}
                  </p>
                </div>
              ) : "sourceText" in selectedItem ? (
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {t("translation.source")} ({selectedItem.sourceLanguage === "ar" ? "العربية" : "English"})
                      </p>
                      <p
                        className="text-sm p-3 rounded-md bg-muted/50"
                        dir={selectedItem.sourceLanguage === "ar" ? "rtl" : "ltr"}
                      >
                        {selectedItem.sourceText}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {t("translation.target")} ({selectedItem.targetLanguage === "ar" ? "العربية" : "English"})
                      </p>
                      <p
                        className="text-sm p-3 rounded-md bg-muted/50"
                        dir={selectedItem.targetLanguage === "ar" ? "rtl" : "ltr"}
                      >
                        {selectedItem.translatedText}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{t(`docType.${selectedItem.documentType}`)}</Badge>
                      <Badge variant="outline">{t(`purpose.${selectedItem.purpose}`)}</Badge>
                      <Badge variant="outline">{t(`tone.${selectedItem.tone}`)}</Badge>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">{t("memo.type")}</p>
                        <p className="text-sm">{t(`memoType.${selectedItem.type}`)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">{t("memo.strength")}</p>
                        <p className="text-sm">{t(`strength.${selectedItem.strength}`)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">{t("memo.court")}</p>
                        <p className="text-sm">{selectedItem.courtName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">{t("memo.caseNumber")}</p>
                        <p className="text-sm font-mono">{selectedItem.caseNumber}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">{t("memo.facts")}</p>
                      <p className="text-sm p-3 rounded-md bg-muted/50">{selectedItem.caseFacts}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {language === "ar" ? "المحتوى المُنشأ" : "Generated Content"}
                      </p>
                      <p
                        className="text-sm p-3 rounded-md bg-muted/50 whitespace-pre-wrap"
                        dir={selectedItem.language === "ar" ? "rtl" : "ltr"}
                      >
                        {selectedItem.generatedContent}
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
