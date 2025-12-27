import { Languages, FileText, ArrowRight, ArrowLeft, Clock, Plus, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import type { Translation, Memorandum } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export default function Dashboard() {
  const { t, isRTL, language } = useI18n();
  const { user } = useAuth();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const dateLocale = language === "ar" ? ar : enUS;

  const { data: translations, isLoading: loadingTranslations } = useQuery<Translation[]>({
    queryKey: ["/api/translations"],
  });

  const { data: memorandums, isLoading: loadingMemos } = useQuery<Memorandum[]>({
    queryKey: ["/api/memorandums"],
  });

  const recentTranslations = translations?.slice(0, 5) || [];
  const recentMemos = memorandums?.slice(0, 5) || [];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return isRTL ? "صباح الخير" : "Good morning";
    if (hour < 18) return isRTL ? "مساء الخير" : "Good afternoon";
    return isRTL ? "مساء الخير" : "Good evening";
  };

  const userName = user?.firstName || (isRTL ? "المستخدم" : "there");

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <div className="relative overflow-hidden rounded-2xl luxury-gradient p-8 lg:p-10">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative">
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight" data-testid="text-dashboard-title">
            {greeting()}, {userName}
          </h1>
          <p className="text-white/70 mt-2 text-lg">
            {isRTL ? "إليك نظرة عامة على نشاطك الأخير" : "Here's an overview of your recent activity"}
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button asChild className="bg-white/10 text-white border-white/20" variant="outline" data-testid="button-hero-translation">
              <Link href="/translation">
                <Languages className="h-4 w-4" />
                <span className={isRTL ? "mr-2" : "ml-2"}>{t("dashboard.newTranslation")}</span>
              </Link>
            </Button>
            <Button asChild className="bg-white text-primary" data-testid="button-hero-memo">
              <Link href="/memorandum">
                <FileText className="h-4 w-4" />
                <span className={isRTL ? "mr-2" : "ml-2"}>{t("dashboard.newMemo")}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-visible border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.stats.translations")}
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
              <Languages className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold" data-testid="text-stat-translations">
              {loadingTranslations ? <Skeleton className="h-10 w-16" /> : translations?.length || 0}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <p className="text-xs text-muted-foreground">
                {t("dashboard.stats.thisMonth")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-visible border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.stats.memos")}
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold" data-testid="text-stat-memos">
              {loadingMemos ? <Skeleton className="h-10 w-16" /> : memorandums?.length || 0}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <p className="text-xs text-muted-foreground">
                {t("dashboard.stats.thisMonth")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-0 shadow-md bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">{t("dashboard.quickActions")}</CardTitle>
                <CardDescription className="text-xs">
                  {isRTL ? "ابدأ مهمة جديدة بسرعة" : "Quickly start a new task"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild size="lg" data-testid="button-new-translation">
              <Link href="/translation">
                <Plus className="h-4 w-4" />
                <span className={isRTL ? "mr-2" : "ml-2"}>{t("dashboard.newTranslation")}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" data-testid="button-new-memo">
              <Link href="/memorandum">
                <Plus className="h-4 w-4" />
                <span className={isRTL ? "mr-2" : "ml-2"}>{t("dashboard.newMemo")}</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
            <div>
              <CardTitle className="text-lg font-semibold">
                {t("dashboard.recentTranslations")}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {isRTL ? "آخر الترجمات التي قمت بها" : "Your latest translations"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/history" data-testid="link-view-all-translations">
                {isRTL ? "عرض الكل" : "View all"}
                <ArrowIcon className={`h-4 w-4 ${isRTL ? "mr-1" : "ml-1"}`} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loadingTranslations ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : recentTranslations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <Languages className="h-8 w-8 opacity-40" />
                </div>
                <p className="text-sm font-medium">{t("history.noItems")}</p>
                <p className="text-xs mt-1 opacity-70">
                  {isRTL ? "ابدأ ترجمة جديدة الآن" : "Start a new translation now"}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/translation">
                    <Plus className="h-3 w-3" />
                    <span className={isRTL ? "mr-1" : "ml-1"}>{t("dashboard.newTranslation")}</span>
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTranslations.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-muted/30 hover-elevate cursor-pointer transition-all duration-200"
                    data-testid={`card-translation-${item.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2 leading-relaxed">
                          {item.sourceText.substring(0, 120)}
                          {item.sourceText.length > 120 ? "..." : ""}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs font-medium">
                            {item.sourceLanguage === "ar" ? "AR → EN" : "EN → AR"}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(item.createdAt), { 
                              addSuffix: true,
                              locale: dateLocale 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
            <div>
              <CardTitle className="text-lg font-semibold">
                {t("dashboard.recentMemos")}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {isRTL ? "آخر المذكرات التي صغتها" : "Your latest memorandums"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/history" data-testid="link-view-all-memos">
                {isRTL ? "عرض الكل" : "View all"}
                <ArrowIcon className={`h-4 w-4 ${isRTL ? "mr-1" : "ml-1"}`} />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loadingMemos ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : recentMemos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <FileText className="h-8 w-8 opacity-40" />
                </div>
                <p className="text-sm font-medium">{t("history.noItems")}</p>
                <p className="text-xs mt-1 opacity-70">
                  {isRTL ? "ابدأ صياغة مذكرة جديدة" : "Start drafting a new memorandum"}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/memorandum">
                    <Plus className="h-3 w-3" />
                    <span className={isRTL ? "mr-1" : "ml-1"}>{t("dashboard.newMemo")}</span>
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMemos.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-muted/30 hover-elevate cursor-pointer transition-all duration-200"
                    data-testid={`card-memo-${item.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {t(`memoType.${item.type}`)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.courtName} - {item.caseNumber}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs font-medium">
                            {item.language === "ar" ? "العربية" : "English"}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(item.createdAt), { 
                              addSuffix: true,
                              locale: dateLocale 
                            })}
                          </span>
                        </div>
                      </div>
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
