import { Languages, FileText, ArrowRight, ArrowLeft, Clock, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Translation, Memorandum } from "@shared/schema";

export default function Dashboard() {
  const { t, isRTL } = useI18n();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const { data: translations, isLoading: loadingTranslations } = useQuery<Translation[]>({
    queryKey: ["/api/translations"],
  });

  const { data: memorandums, isLoading: loadingMemos } = useQuery<Memorandum[]>({
    queryKey: ["/api/memorandums"],
  });

  const recentTranslations = translations?.slice(0, 3) || [];
  const recentMemos = memorandums?.slice(0, 3) || [];

  return (
    <div className="p-6 space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground" data-testid="text-dashboard-title">
          {t("dashboard.welcome")}
        </h1>
        <p className="text-muted-foreground">
          {t("app.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.stats.translations")}
            </CardTitle>
            <Languages className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-stat-translations">
              {loadingTranslations ? <Skeleton className="h-8 w-16" /> : translations?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("dashboard.stats.thisMonth")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.stats.memos")}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-stat-memos">
              {loadingMemos ? <Skeleton className="h-8 w-16" /> : memorandums?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("dashboard.stats.thisMonth")}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.quickActions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild data-testid="button-new-translation">
              <Link href="/translation">
                <Languages className="h-4 w-4" />
                <span className={isRTL ? "mr-2" : "ml-2"}>{t("dashboard.newTranslation")}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" data-testid="button-new-memo">
              <Link href="/memorandum">
                <FileText className="h-4 w-4" />
                <span className={isRTL ? "mr-2" : "ml-2"}>{t("dashboard.newMemo")}</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base font-medium">
              {t("dashboard.recentTranslations")}
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/history" data-testid="link-view-all-translations">
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loadingTranslations ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentTranslations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Languages className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t("history.noItems")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTranslations.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-md bg-muted/50 hover-elevate"
                    data-testid={`card-translation-${item.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm line-clamp-2 flex-1">
                        {item.sourceText.substring(0, 100)}...
                      </p>
                      <Clock className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.sourceLanguage === "ar" ? t("translation.arToEn") : t("translation.enToAr")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base font-medium">
              {t("dashboard.recentMemos")}
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/history" data-testid="link-view-all-memos">
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loadingMemos ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentMemos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t("history.noItems")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMemos.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-md bg-muted/50 hover-elevate"
                    data-testid={`card-memo-${item.id}`}
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
                      <Clock className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
