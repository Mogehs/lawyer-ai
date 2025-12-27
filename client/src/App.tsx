import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme-provider";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import Dashboard from "@/pages/dashboard";
import Translation from "@/pages/translation";
import Memorandum from "@/pages/memorandum";
import History from "@/pages/history";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/translation" component={Translation} />
      <Route path="/memorandum" component={Memorandum} />
      <Route path="/history" component={History} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const { isRTL } = useI18n();

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className={`flex h-screen w-full ${isRTL ? "flex-row-reverse" : ""}`}>
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background sticky top-0 z-50">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </header>
          <AIDisclaimer />
          <main className="flex-1 overflow-auto bg-background">
            <Router />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="legal-ai-theme">
        <I18nProvider>
          <TooltipProvider>
            <AppLayout />
            <Toaster />
          </TooltipProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
