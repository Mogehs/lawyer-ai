import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Scale, Mail, Lock, User, ArrowRight, Loader2, Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { isRTL, language, setLanguage } = useI18n();
  const { login, register, isLoggingIn, isRegistering } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", firstName: "", lastName: "" },
  });

  const onLogin = async (data: LoginForm) => {
    try {
      await login(data);
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في تسجيل الدخول" : "Login Error",
        description: error.message || (isRTL ? "تحقق من البريد الإلكتروني وكلمة المرور" : "Check your email and password"),
        variant: "destructive",
      });
    }
  };

  const onRegister = async (data: RegisterForm) => {
    try {
      await register(data);
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في إنشاء الحساب" : "Registration Error",
        description: error.message || (isRTL ? "فشل إنشاء الحساب" : "Failed to create account"),
        variant: "destructive",
      });
    }
  };

  const isSubmitting = isLoggingIn || isRegistering;

  return (
    <div className="min-h-screen flex" dir={isRTL ? "rtl" : "ltr"}>
      <div className="hidden lg:flex lg:w-1/2 luxury-gradient items-center justify-center p-12 relative">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative text-center text-white max-w-md">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
            <Scale className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            {isRTL ? "النظام القانوني الذكي" : "Legal AI System"}
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            {isRTL
              ? "منصة متكاملة للترجمة القانونية وصياغة المذكرات بالذكاء الاصطناعي"
              : "A comprehensive platform for AI-powered legal translation and memorandum drafting"}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="flex justify-end mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" data-testid="button-auth-language">
                  <Globe className="w-4 h-4" />
                  {language === "ar" ? "العربية" : "English"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"}>
                <DropdownMenuItem onClick={() => setLanguage("en")} className="gap-2 cursor-pointer">
                  {language === "en" && <Check className="w-4 h-4 text-primary" />}
                  {language !== "en" && <span className="w-4" />}
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ar")} className="gap-2 cursor-pointer">
                  {language === "ar" && <Check className="w-4 h-4 text-primary" />}
                  {language !== "ar" && <span className="w-4" />}
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[hsl(220,60%,30%)] to-[hsl(220,50%,20%)] flex items-center justify-center shadow-lg">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold">
              {isRTL ? "النظام القانوني الذكي" : "Legal AI"}
            </h1>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">
                {isLogin 
                  ? (isRTL ? "تسجيل الدخول" : "Sign In")
                  : (isRTL ? "إنشاء حساب" : "Create Account")}
              </CardTitle>
              <CardDescription>
                {isLogin
                  ? (isRTL ? "أدخل بياناتك للوصول إلى حسابك" : "Enter your credentials to access your account")
                  : (isRTL ? "أنشئ حساباً جديداً للبدء" : "Create a new account to get started")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLogin ? (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "البريد الإلكتروني" : "Email"}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none ${isRTL ? "right-3" : "left-3"}`} />
                              <Input
                                {...field}
                                type="email"
                                placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                                className={isRTL ? "pr-10" : "pl-10"}
                                data-testid="input-email"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "كلمة المرور" : "Password"}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none ${isRTL ? "right-3" : "left-3"}`} />
                              <Input
                                {...field}
                                type="password"
                                placeholder={isRTL ? "أدخل كلمة المرور" : "Enter your password"}
                                className={isRTL ? "pr-10" : "pl-10"}
                                data-testid="input-password"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-submit-login">
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {isRTL ? "تسجيل الدخول" : "Sign In"}
                          <ArrowRight className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{isRTL ? "الاسم الأول" : "First Name"}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none ${isRTL ? "right-3" : "left-3"}`} />
                                <Input
                                  {...field}
                                  placeholder={isRTL ? "الاسم" : "First"}
                                  className={isRTL ? "pr-10" : "pl-10"}
                                  data-testid="input-first-name"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{isRTL ? "اسم العائلة" : "Last Name"}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={isRTL ? "العائلة" : "Last"}
                                data-testid="input-last-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "البريد الإلكتروني" : "Email"}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none ${isRTL ? "right-3" : "left-3"}`} />
                              <Input
                                {...field}
                                type="email"
                                placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                                className={isRTL ? "pr-10" : "pl-10"}
                                data-testid="input-register-email"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? "كلمة المرور" : "Password"}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none ${isRTL ? "right-3" : "left-3"}`} />
                              <Input
                                {...field}
                                type="password"
                                placeholder={isRTL ? "6 أحرف على الأقل" : "At least 6 characters"}
                                className={isRTL ? "pr-10" : "pl-10"}
                                data-testid="input-register-password"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-submit-register">
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {isRTL ? "إنشاء حساب" : "Create Account"}
                          <ArrowRight className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-primary hover:underline"
                  data-testid="button-toggle-auth-mode"
                >
                  {isLogin
                    ? (isRTL ? "ليس لديك حساب؟ أنشئ حساباً جديداً" : "Don't have an account? Sign up")
                    : (isRTL ? "لديك حساب؟ سجل الدخول" : "Already have an account? Sign in")}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
