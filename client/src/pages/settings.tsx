import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scale, Moon, Sun, Globe } from "lucide-react";

export default function Settings() {
  const { t, isRTL, language, setLanguage } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6 max-w-2xl" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground" data-testid="text-settings-title">
          {t("nav.settings")}
        </h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4" />
              {language === "ar" ? "العلامة التجارية" : "Branding"}
            </CardTitle>
            <CardDescription>
              {language === "ar"
                ? "تخصيص هوية النظام لمكتب المحاماة"
                : "Customize the system identity for your law firm"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">
                  {language === "ar" ? "اسم المكتب" : "Firm Name"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "ar" ? "يظهر في رأس الصفحة والتقارير" : "Appears in header and reports"}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === "ar" ? "النظام القانوني الذكي" : "Legal AI System"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {language === "ar" ? "اللغة والعرض" : "Language & Display"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="language">{language === "ar" ? "لغة الواجهة" : "Interface Language"}</Label>
                <p className="text-xs text-muted-foreground">
                  {language === "ar" ? "تغيير لغة واجهة المستخدم" : "Change the UI language"}
                </p>
              </div>
              <Select value={language} onValueChange={(val) => setLanguage(val as "ar" | "en")}>
                <SelectTrigger className="w-[140px]" data-testid="select-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t">
              <div>
                <Label htmlFor="theme">{language === "ar" ? "المظهر" : "Theme"}</Label>
                <p className="text-xs text-muted-foreground">
                  {language === "ar" ? "الوضع الفاتح أو الداكن" : "Light or dark mode"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch
                  id="theme"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  data-testid="switch-theme"
                />
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {language === "ar" ? "حول النظام" : "About"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>{language === "ar" ? "الإصدار:" : "Version:"}</strong> 1.0.0
              </p>
              <p>
                <strong>{language === "ar" ? "الغرض:" : "Purpose:"}</strong>{" "}
                {language === "ar"
                  ? "أداة مساعدة للترجمة القانونية وصياغة المذكرات"
                  : "Legal translation and memorandum drafting assistant"}
              </p>
              <div className="pt-4 p-3 rounded-md bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700">
                <p className="text-amber-800 dark:text-amber-200 text-xs">
                  {language === "ar"
                    ? "⚠️ جميع المخرجات هي مسودات غير ملزمة ويجب مراجعتها واعتمادها من قبل محامين مرخصين."
                    : "⚠️ All outputs are non-binding drafts and must be reviewed and approved by licensed lawyers."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
