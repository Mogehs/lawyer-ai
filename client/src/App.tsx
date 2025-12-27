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
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Scale } from "lucide-react";
import Dashboard from "@/pages/dashboard";
import Translation from "@/pages/translation";
import Memorandum from "@/pages/memorandum";
import History from "@/pages/history";
import Settings from "@/pages/settings";
import AdminPage from "@/pages/admin";
import AuthPage from "@/pages/auth";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/translation" component={Translation} />
      <Route path="/memorandum" component={Memorandum} />
      <Route path="/history" component={History} />
      <Route path="/settings" component={Settings} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function UserMenu() {
  const { user, logout, isLoggingOut } = useAuth();
  const { t, isRTL } = useI18n();

  if (!user) return null;

  const initials = [user.firstName?.[0], user.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || user.email?.[0]?.toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" data-testid="button-user-menu">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/settings" className="cursor-pointer gap-2">
            <User className="w-4 h-4" />
            {t("nav.settings")}
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => logout()} 
          disabled={isLoggingOut}
          className="text-destructive focus:text-destructive cursor-pointer gap-2"
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4" />
          {isRTL ? "تسجيل الخروج" : "Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppLayout() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-4 px-4 h-14 border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
            </div>
            <div className="flex items-center gap-1">
              <LanguageToggle />
              <ThemeToggle />
              <div className="w-px h-6 bg-border mx-2" />
              <UserMenu />
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

function AuthenticatedApp() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(220,60%,30%)] to-[hsl(220,50%,20%)] flex items-center justify-center shadow-lg">
            <Scale className="w-7 h-7 text-white/50" />
          </div>
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <AppLayout />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="legal-ai-theme">
        <I18nProvider>
          <TooltipProvider>
            <AuthenticatedApp />
            <Toaster />
          </TooltipProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
