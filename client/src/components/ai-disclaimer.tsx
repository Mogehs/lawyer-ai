import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function AIDisclaimer() {
  const { t, isRTL } = useI18n();

  return (
    <div 
      className="bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 px-4 py-2 flex items-center gap-3"
      data-testid="banner-ai-disclaimer"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
      <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
        <span className="font-semibold">{t("disclaimer.title")}</span>
        <span className="mx-2">—</span>
        <span>{t("disclaimer.text")}</span>
      </p>
    </div>
  );
}
