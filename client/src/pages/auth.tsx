import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Scale, ArrowRight, Loader2, Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { isRTL, language, setLanguage } = useI18n();
  const { login, register, isLoggingIn, isRegistering } = useAuth();
  const { toast } = useToast();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const isSubmitting = isLoggingIn || isRegistering;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "الرجاء إدخال البريد الإلكتروني وكلمة المرور" : "Please enter email and password",
        variant: "destructive",
      });
      return;
    }
    try {
      await login({ email: loginEmail, password: loginPassword });
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في تسجيل الدخول" : "Login Error",
        description: error.message || (isRTL ? "تحقق من البريد الإلكتروني وكلمة المرور" : "Check your email and password"),
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword || !firstName) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "الرجاء ملء جميع الحقول المطلوبة" : "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    if (registerPassword.length < 6) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }
    try {
      await register({ email: registerEmail, password: registerPassword, firstName, lastName });
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في إنشاء الحساب" : "Registration Error",
        description: error.message || (isRTL ? "فشل إنشاء الحساب" : "Failed to create account"),
        variant: "destructive",
      });
    }
  };

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
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{isRTL ? "البريد الإلكتروني" : "Email"}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">{isRTL ? "كلمة المرور" : "Password"}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder={isRTL ? "أدخل كلمة المرور" : "Enter your password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      data-testid="input-password"
                    />
                  </div>
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
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">{isRTL ? "الاسم الأول" : "First Name"}</Label>
                      <Input
                        id="first-name"
                        placeholder={isRTL ? "الاسم" : "First"}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        data-testid="input-first-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">{isRTL ? "اسم العائلة" : "Last Name"}</Label>
                      <Input
                        id="last-name"
                        placeholder={isRTL ? "العائلة" : "Last"}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">{isRTL ? "البريد الإلكتروني" : "Email"}</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      data-testid="input-register-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">{isRTL ? "كلمة المرور" : "Password"}</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder={isRTL ? "6 أحرف على الأقل" : "At least 6 characters"}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      data-testid="input-register-password"
                    />
                  </div>
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
