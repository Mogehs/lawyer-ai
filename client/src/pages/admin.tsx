import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Users, Image, Type, Save, Loader2 } from "lucide-react";
import type { User, SiteSettings } from "@shared/schema";
import { Redirect } from "wouter";

const settingsSchema = z.object({
  logoUrl: z.string().optional().nullable(),
  appTitle: z.string().optional().nullable(),
  appSubtitle: z.string().optional().nullable(),
  footerText: z.string().optional().nullable(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

type UserWithoutPassword = Omit<User, "passwordHash">;

export default function AdminPage() {
  const { isRTL, language } = useI18n();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading: settingsLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/settings"],
  });

  const { data: users, isLoading: usersLoading } = useQuery<UserWithoutPassword[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAdmin,
  });

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      logoUrl: "",
      appTitle: "",
      appSubtitle: "",
      footerText: "",
    },
    values: settings ? {
      logoUrl: settings.logoUrl || "",
      appTitle: settings.appTitle || "",
      appSubtitle: settings.appSubtitle || "",
      footerText: settings.footerText || "",
    } : undefined,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      const response = await apiRequest("PUT", "/api/settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: isRTL ? "تم الحفظ" : "Saved",
        description: isRTL ? "تم حفظ الإعدادات بنجاح" : "Settings saved successfully",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل حفظ الإعدادات" : "Failed to save settings",
        variant: "destructive",
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}/role`, { role });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: isRTL ? "تم التحديث" : "Updated",
        description: isRTL ? "تم تحديث دور المستخدم" : "User role updated",
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل تحديث الدور" : "Failed to update role",
        variant: "destructive",
      });
    },
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Redirect to="/" />;
  }

  const onSubmit = (data: SettingsFormData) => {
    updateSettingsMutation.mutate(data);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground" data-testid="text-admin-title">
            {isRTL ? "لوحة الإدارة" : "Admin Panel"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isRTL 
            ? "إدارة إعدادات النظام والمستخدمين" 
            : "Manage system settings and users"}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Image className="h-4 w-4" />
              {isRTL ? "العلامة التجارية" : "Branding Settings"}
            </CardTitle>
            <CardDescription>
              {isRTL
                ? "تخصيص الشعار والعناوين التي تظهر في النظام"
                : "Customize the logo and titles displayed in the system"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isRTL ? "رابط الشعار" : "Logo URL"}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={isRTL ? "https://example.com/logo.png" : "https://example.com/logo.png"} 
                          {...field}
                          value={field.value || ""}
                          data-testid="input-logo-url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isRTL ? "عنوان التطبيق" : "Application Title"}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={isRTL ? "النظام القانوني الذكي" : "AI Legal System"} 
                          {...field}
                          value={field.value || ""}
                          data-testid="input-app-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appSubtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isRTL ? "العنوان الفرعي" : "Subtitle"}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={isRTL ? "مدعوم بالذكاء الاصطناعي" : "AI-Powered Legal Tools"} 
                          {...field}
                          value={field.value || ""}
                          data-testid="input-app-subtitle"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="footerText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isRTL ? "نص التذييل" : "Footer Text"}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={isRTL ? "جميع الحقوق محفوظة" : "All Rights Reserved"} 
                          {...field}
                          value={field.value || ""}
                          data-testid="input-footer-text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={updateSettingsMutation.isPending}
                  data-testid="button-save-settings"
                >
                  {updateSettingsMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span className={isRTL ? "mr-2" : "ml-2"}>
                    {isRTL ? "حفظ الإعدادات" : "Save Settings"}
                  </span>
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              {isRTL ? "إدارة المستخدمين" : "User Management"}
            </CardTitle>
            <CardDescription>
              {isRTL
                ? "عرض جميع المستخدمين وتعديل صلاحياتهم"
                : "View all users and manage their roles"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : users && users.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isRTL ? "المستخدم" : "User"}</TableHead>
                      <TableHead>{isRTL ? "البريد الإلكتروني" : "Email"}</TableHead>
                      <TableHead>{isRTL ? "الدور" : "Role"}</TableHead>
                      <TableHead>{isRTL ? "تاريخ التسجيل" : "Joined"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                        <TableCell className="font-medium">
                          {user.firstName || user.lastName 
                            ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                            : isRTL ? "بدون اسم" : "No name"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(value) => 
                              updateRoleMutation.mutate({ userId: user.id, role: value })
                            }
                            disabled={updateRoleMutation.isPending}
                          >
                            <SelectTrigger className="w-[120px]" data-testid={`select-role-${user.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">
                                {isRTL ? "مستخدم" : "User"}
                              </SelectItem>
                              <SelectItem value="admin">
                                {isRTL ? "مدير" : "Admin"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {user.createdAt 
                            ? new Date(user.createdAt).toLocaleDateString(isRTL ? "ar" : "en")
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {isRTL ? "لا يوجد مستخدمون" : "No users found"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
