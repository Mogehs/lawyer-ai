import { Home, Languages, FileText, History, Settings, Scale, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { t, isRTL } = useI18n();
  const [location] = useLocation();

  const menuItems = [
    { title: t("nav.dashboard"), url: "/", icon: Home },
    { title: t("nav.translation"), url: "/translation", icon: Languages },
    { title: t("nav.memorandum"), url: "/memorandum", icon: FileText },
    { title: t("nav.history"), url: "/history", icon: History },
  ];

  return (
    <Sidebar side={isRTL ? "right" : "left"} className="border-sidebar-border">
      <SidebarHeader className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sidebar-primary to-[hsl(38,65%,45%)] flex items-center justify-center shadow-md">
            <Scale className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className="font-semibold text-sidebar-foreground text-base tracking-tight">
              {t("app.title")}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-3 h-3 text-sidebar-primary" />
              <p className="text-xs text-sidebar-foreground/70">
                {isRTL ? "مدعوم بالذكاء الاصطناعي" : "AI-Powered"}
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    className="gap-3 py-2.5 px-3 rounded-lg transition-all"
                  >
                    <Link href={item.url} data-testid={`link-nav-${item.url.replace("/", "") || "home"}`}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              className="gap-3 py-2.5 px-3 rounded-lg"
              isActive={location === "/settings"}
            >
              <Link href="/settings" data-testid="link-nav-settings">
                <Settings className="h-4 w-4" />
                <span className="font-medium">{t("nav.settings")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
