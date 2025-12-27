import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { Scale, Languages, FileText, Shield, ArrowRight } from "lucide-react";

export default function Landing() {
  const { t, isRTL } = useI18n();

  const features = [
    {
      icon: Languages,
      titleEn: "Legal Translation",
      titleAr: "الترجمة القانونية",
      descEn: "AI-powered Arabic-English legal translation with jurisdiction-specific accuracy",
      descAr: "ترجمة قانونية عربية-إنجليزية بالذكاء الاصطناعي مع دقة خاصة بالاختصاص القضائي",
    },
    {
      icon: FileText,
      titleEn: "Memorandum Drafting",
      titleAr: "صياغة المذكرات",
      descEn: "Generate professional legal memorandums with AI assistance",
      descAr: "إنشاء مذكرات قانونية احترافية بمساعدة الذكاء الاصطناعي",
    },
    {
      icon: Shield,
      titleEn: "Secure & Private",
      titleAr: "آمن وخاص",
      descEn: "Enterprise-grade security for your confidential legal documents",
      descAr: "أمان على مستوى المؤسسات لوثائقك القانونية السرية",
    },
  ];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                {isRTL ? "النظام القانوني الذكي" : "Legal AI"}
              </h1>
            </div>
          </div>
          <Button asChild data-testid="button-login">
            <a href="/api/login">
              {isRTL ? "تسجيل الدخول" : "Sign In"}
              <ArrowRight className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
            </a>
          </Button>
        </div>
      </header>

      <main>
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {isRTL 
                ? "نظام الترجمة وصياغة المذكرات القانونية بالذكاء الاصطناعي"
                : "AI-Powered Legal Translation & Memorandum System"}
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {isRTL
                ? "أداة احترافية للمحامين لترجمة الوثائق القانونية وصياغة المذكرات باللغتين العربية والإنجليزية"
                : "A professional tool for lawyers to translate legal documents and draft memorandums in Arabic and English"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base px-8" data-testid="button-get-started">
                <a href="/api/login">
                  {isRTL ? "ابدأ الآن" : "Get Started"}
                  <ArrowRight className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <h3 className="text-2xl font-semibold text-center mb-12">
              {isRTL ? "المميزات الرئيسية" : "Key Features"}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      {isRTL ? feature.titleAr : feature.titleEn}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {isRTL ? feature.descAr : feature.descEn}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
              <Shield className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                {isRTL ? "تنويه مهم" : "Important Notice"}
              </h4>
              <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                {isRTL
                  ? "جميع المحتويات المُنتجة بواسطة الذكاء الاصطناعي هي مسودات أولية تتطلب مراجعة المحامي قبل الاستخدام"
                  : "All AI-generated content is a preliminary draft that requires lawyer review before use"}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>{isRTL ? "© 2024 النظام القانوني الذكي" : "© 2024 Legal AI System"}</p>
        </div>
      </footer>
    </div>
  );
}
