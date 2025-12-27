import { Home, Languages, FileText, History, Settings, Scale } from "lucide-react";
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
    <Sidebar side={isRTL ? "right" : "left"} className="border-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-md">
            <Scale className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className="font-semibold text-sidebar-foreground text-sm">
              {t("app.title")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("app.subtitle")}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    className="gap-3"
                  >
                    <Link href={item.url} data-testid={`link-nav-${item.url.replace("/", "") || "home"}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="gap-3">
              <Link href="/settings" data-testid="link-nav-settings">
                <Settings className="h-4 w-4" />
                <span>{t("nav.settings")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
