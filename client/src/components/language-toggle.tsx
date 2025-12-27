import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function LanguageToggle() {
  const { language, setLanguage } = useI18n();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
      className="font-medium min-w-[60px]"
      data-testid="button-language-toggle"
    >
      {language === "ar" ? "EN" : "عربي"}
    </Button>
  );
}
