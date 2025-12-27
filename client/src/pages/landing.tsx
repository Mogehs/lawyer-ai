import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { Scale, Languages, FileText, Shield, ArrowRight, Globe, Check, Sparkles, Building2, Lock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Landing() {
  const { t, isRTL, language, setLanguage } = useI18n();

  const features = [
    {
      icon: Languages,
      titleEn: "Legal Translation",
      titleAr: "الترجمة القانونية",
      descEn: "AI-powered Arabic-English legal translation with jurisdiction-specific accuracy and legal terminology precision",
      descAr: "ترجمة قانونية عربية-إنجليزية بالذكاء الاصطناعي مع دقة خاصة بالاختصاص القضائي والمصطلحات القانونية",
    },
    {
      icon: FileText,
      titleEn: "Memorandum Drafting",
      titleAr: "صياغة المذكرات",
      descEn: "Generate professional legal memorandums, defense statements, and court filings with AI assistance",
      descAr: "إنشاء مذكرات قانونية احترافية وبيانات الدفاع والإيداعات القضائية بمساعدة الذكاء الاصطناعي",
    },
    {
      icon: Lock,
      titleEn: "Secure & Private",
      titleAr: "آمن وخاص",
      descEn: "Enterprise-grade security ensures your confidential legal documents remain protected",
      descAr: "أمان على مستوى المؤسسات يضمن حماية وثائقك القانونية السرية",
    },
    {
      icon: Building2,
      titleEn: "Multi-Jurisdiction",
      titleAr: "متعدد الاختصاصات",
      descEn: "Optimized for Qatar, GCC, and international legal frameworks with localized formatting",
      descAr: "محسّن لقطر ودول مجلس التعاون الخليجي والأطر القانونية الدولية مع تنسيق محلي",
    },
  ];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[hsl(220,60%,30%)] to-[hsl(220,50%,20%)] flex items-center justify-center shadow-lg">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                {isRTL ? "النظام القانوني الذكي" : "Legal AI"}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {isRTL ? "ترجمة وصياغة قانونية" : "Translation & Drafting"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" data-testid="button-language-dropdown">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{language === "ar" ? "العربية" : "English"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"}>
                <DropdownMenuItem 
                  onClick={() => setLanguage("en")}
                  className="gap-2 cursor-pointer"
                  data-testid="menu-item-english"
                >
                  {language === "en" && <Check className="w-4 h-4 text-primary" />}
                  {language !== "en" && <span className="w-4" />}
                  English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage("ar")}
                  className="gap-2 cursor-pointer"
                  data-testid="menu-item-arabic"
                >
                  {language === "ar" && <Check className="w-4 h-4 text-primary" />}
                  {language !== "ar" && <span className="w-4" />}
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild data-testid="button-login">
              <a href="/api/login">
                {isRTL ? "تسجيل الدخول" : "Sign In"}
                <ArrowRight className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 luxury-gradient opacity-95" />
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
          
          <div className="container relative z-10 mx-auto px-6 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-[hsl(38,75%,55%)]" />
              <span className="text-sm text-white/90">
                {isRTL ? "مدعوم بالذكاء الاصطناعي" : "Powered by AI"}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              {isRTL 
                ? "نظام الترجمة وصياغة\nالمذكرات القانونية"
                : "Legal Translation &\nMemorandum System"}
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              {isRTL
                ? "أداة احترافية للمحامين لترجمة الوثائق القانونية وصياغة المذكرات باللغتين العربية والإنجليزية مع دعم كامل للاتجاهين"
                : "A professional tool for lawyers to translate legal documents and draft memorandums in Arabic and English with full bidirectional support"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base px-8 bg-[hsl(38,75%,55%)] text-[hsl(220,35%,10%)] border-[hsl(38,65%,45%)]" data-testid="button-get-started">
                <a href="/api/login">
                  {isRTL ? "ابدأ الآن" : "Get Started"}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 bg-white/10 border-white/30 text-white backdrop-blur-sm">
                {isRTL ? "تعرف على المزيد" : "Learn More"}
              </Button>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h3 className="text-sm font-semibold text-[hsl(38,75%,50%)] uppercase tracking-wider mb-3">
                {isRTL ? "المميزات" : "Features"}
              </h3>
              <h4 className="text-3xl md:text-4xl font-bold mb-4">
                {isRTL ? "أدوات قانونية متقدمة" : "Advanced Legal Tools"}
              </h4>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {isRTL 
                  ? "مجموعة شاملة من الأدوات المصممة خصيصاً للمحامين والمستشارين القانونيين"
                  : "A comprehensive suite of tools designed specifically for lawyers and legal consultants"}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="group border-0 shadow-lg hover-elevate overflow-visible bg-card">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(220,60%,30%)] to-[hsl(220,50%,22%)] flex items-center justify-center shrink-0 shadow-md">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h5 className="text-lg font-semibold mb-2">
                          {isRTL ? feature.titleAr : feature.titleEn}
                        </h5>
                        <p className="text-muted-foreground leading-relaxed">
                          {isRTL ? feature.descAr : feature.descEn}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/30 p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Shield className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-2">
                      {isRTL ? "تنويه مهم" : "Important Notice"}
                    </h4>
                    <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                      {isRTL
                        ? "جميع المحتويات المُنتجة بواسطة الذكاء الاصطناعي هي مسودات أولية تتطلب مراجعة المحامي المختص قبل الاستخدام في أي إجراءات قانونية رسمية."
                        : "All AI-generated content is a preliminary draft that requires review by a qualified lawyer before use in any official legal proceedings."}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {isRTL ? "ابدأ اليوم" : "Get Started Today"}
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              {isRTL 
                ? "انضم إلى مئات المحامين الذين يستخدمون نظامنا لتحسين كفاءة عملهم"
                : "Join hundreds of lawyers using our system to improve their work efficiency"}
            </p>
            <Button size="lg" asChild className="text-base px-10" data-testid="button-cta">
              <a href="/api/login">
                {isRTL ? "إنشاء حساب مجاني" : "Create Free Account"}
                <ArrowRight className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-6 bg-muted/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[hsl(220,60%,30%)] to-[hsl(220,50%,20%)] flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">
                {isRTL ? "النظام القانوني الذكي" : "Legal AI"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {isRTL ? "© 2024 جميع الحقوق محفوظة" : "© 2024 All rights reserved"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
