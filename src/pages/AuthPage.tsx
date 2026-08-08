import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { API_URL } from "@/config";

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, signIn, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // OTP States
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [tempUserId, setTempUserId] = useState("");

  // Forgot Password States
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!isLogin) {
      setAuthMethod("email");
    }
    // Reset forgot password mode when switching login/signup
    setForgotMode(false);
    setForgotStep(1);
  }, [isLogin]);

  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    fullName: "",
  });

  const handleSendForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      toast({ title: "OTP Sent successfully!", description: "Please check your email for the code." });
      setForgotStep(2);
    } catch (error: any) {
      toast({ title: "Failed to send OTP", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotOtp.length !== 6) {
      toast({ title: "Invalid Code", description: "OTP must be exactly 6 digits.", variant: "destructive" });
      return;
    }
    toast({ title: "OTP Verified", description: "Please enter your new password." });
    setForgotStep(3);
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      toast({ title: "Success!", description: "Password reset successfully. You can now login with your new password." });
      setForgotMode(false);
      setForgotStep(1);
      setForgotOtp("");
      setNewPassword("");
      setConfirmPassword("");
      // Autofill normal login form with new password
      setForm(prev => ({ ...prev, email: forgotEmail, password: newPassword }));
    } catch (error: any) {
      toast({ title: "Reset Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }
  }, [user, isAdmin, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: tempEmail, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");

      toast({ title: "Verified successfully!", description: "Welcome aboard!" });
      signIn(data.access_token, data.user);
      navigate("/");
    } catch (error: any) {
      toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (showOtp) return;
    setLoading(true);
    try {
      const endpoint = isLogin ? "/login" : "/register";
      const res = await fetch(`${API_URL}/api/auth${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          full_name: form.fullName,
          phone: form.phone
        }),
      });
      const data = await res.json();
      
      // If we require verification, show OTP input
      if (res.status === 403 || res.status === 201) {
          if (data.requires_verification) {
              setTempEmail(form.email);
              setShowOtp(true);
              toast({ title: "OTP Sent!", description: data.error || data.message });
              setLoading(false);
              return;
          }
      }

      if (!res.ok) throw new Error(data.error || "Authentication failed");

      toast({ title: isLogin ? "Welcome back!" : "Account created!", description: isLogin ? "Logged in successfully." : "Welcome aboard!" });
      signIn(data.access_token, data.user);
      navigate("/");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async () => {
    setLoading(true);
    try {
      const endpoint = isLogin ? "/login" : "/register";
      const res = await fetch(`${API_URL}/api/auth${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.phone,
          password: form.password,
          full_name: form.fullName
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      toast({ title: isLogin ? "Welcome back!" : "Account created!" });
      signIn(data.access_token, data.user);
      navigate("/");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Google Authentication failed");

        toast({ title: "Google Login Successful", description: "Welcome to Bombay Dry Cleaners!" });
        signIn(data.access_token, data.user);
        navigate("/");
      } catch (error: any) {
        toast({ title: "Google Error", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast({ title: "Google Login Failed", variant: "destructive" })
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleEmailAuth();
  };

  if (showOtp) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto section-padding py-16 flex-1 flex justify-center items-center">
          <div className="w-full max-w-md bg-card border rounded-2xl shadow-lg p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
            <p className="text-muted-foreground mb-6">Enter the 6-digit OTP sent to {tempEmail}</p>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <Input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="text-center tracking-widest text-xl h-14"
                required
              />
              <span className="text-xs text-muted-foreground">The code expires in 10 minutes.</span>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-primary py-10 md:py-14">
        <div className="container mx-auto section-padding text-center flex flex-col items-center justify-center">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt3AbM85cVzKjBDKpwEqkd388Aj-07rQynKQ&s" 
            alt="Bombay Dry Cleaners Logo" 
            className="w-16 h-16 rounded-full object-cover mb-4 shadow-md bg-white p-1"
          />
          <h1 className="text-2xl md:text-4xl font-extrabold text-primary-foreground">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-primary-foreground/80 text-sm mt-2">
            {isLogin ? "Log in to manage your orders" : "Sign up to get started with Bombay Dry Cleaners"}
          </p>
        </div>
      </section>

      <div className="container mx-auto section-padding py-8 md:py-12 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-card border rounded-2xl shadow-lg p-6 md:p-8">
            {forgotMode ? (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">
                    {forgotStep === 1 ? "Forgot Password" : forgotStep === 2 ? "Verify OTP" : "Set New Password"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {forgotStep === 1 
                      ? "Enter your registered email to receive a 6-digit OTP." 
                      : forgotStep === 2 
                        ? `Enter the 6-digit verification code sent to ${forgotEmail}.` 
                        : "Create a secure new password for your account."}
                  </p>
                </div>

                {forgotStep === 1 && (
                  <form onSubmit={handleSendForgotOtp} className="space-y-4">
                    <div>
                      <Label htmlFor="forgotEmail" className="text-sm font-medium text-foreground">Email Address</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="forgotEmail"
                          type="email"
                          placeholder="you@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !forgotEmail}
                      className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? "Sending..." : "Send OTP"}
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setForgotMode(false)}
                      className="w-full text-center text-sm text-muted-foreground font-semibold hover:underline mt-4 block"
                    >
                      Back to Login
                    </button>
                  </form>
                )}

                {forgotStep === 2 && (
                  <form onSubmit={handleVerifyForgotOtp} className="space-y-4">
                    <div>
                      <Label htmlFor="forgotOtp" className="text-sm font-medium text-foreground">OTP Code</Label>
                      <Input
                        id="forgotOtp"
                        type="text"
                        placeholder="000000"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        maxLength={6}
                        className="text-center tracking-widest text-xl h-12 mt-1"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || forgotOtp.length !== 6}
                      className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      Verify OTP
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="w-full text-center text-sm text-muted-foreground font-semibold hover:underline mt-4 block"
                    >
                      Back
                    </button>
                  </form>
                )}

                {forgotStep === 3 && (
                  <form onSubmit={handleSetNewPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">New Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !newPassword || !confirmPassword}
                      className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? "Updating..." : "Set New Password"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div>
                        <Label htmlFor="fullName" className="text-sm font-medium text-foreground">Full Name</Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="fullName"
                            name="fullName"
                            placeholder="Your full name"
                            value={form.fullName}
                            onChange={handleChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</Label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Your mobile number"
                            value={form.phone}
                            onChange={handleChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                      {isLogin && (
                        <button
                          type="button"
                          onClick={() => {
                            setForgotMode(true);
                            setForgotStep(1);
                            setForgotEmail(form.email);
                          }}
                          className="text-xs text-primary font-semibold hover:underline"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        className="pl-10 pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">or continue with</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  className="w-full flex items-center justify-center gap-3 border border-border rounded-xl py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Toggle */}
                <p className="text-center text-sm text-muted-foreground mt-5">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary font-semibold hover:underline"
                  >
                    {isLogin ? "Sign Up" : "Log In"}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthPage;
