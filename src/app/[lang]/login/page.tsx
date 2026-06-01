"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Image from "next/image";
import { Loader2, Eye, EyeOff, ArrowRight, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { user, signInWithGoogle, signUpWithEmail, signInWithEmail, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user && !loading) router.push("/dashboard");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-primary/10" />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex min-h-[calc(100vh-68px)]">
      {/* ── Left panel (decorative, hidden on mobile) ── */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.2),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 px-16 py-12 flex flex-col items-center text-center">
          <Image src="/logo.png" alt="JengaCV" width={72} height={72} className="rounded-2xl mb-8 shadow-xl" />
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Your Career Starts<br />
            <span className="gradient-text">Right Here</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
            Join 40,000+ Tanzanian graduates who built winning CVs with JengaCV.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-xs">
            {[
              { label: "ATS Optimized", icon: <Shield className="w-4 h-4 text-emerald-400" /> },
              { label: "AI-Powered", icon: <Sparkles className="w-4 h-4 text-blue-400" /> },
              { label: "3 min build", icon: <ArrowRight className="w-4 h-4 text-violet-400" /> },
              { label: "Free to start", icon: <ArrowRight className="w-4 h-4 text-amber-400" /> },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                {f.icon}
                <span className="text-sm font-medium text-white">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[var(--shadow-xl)] border border-slate-200/60 dark:border-white/[0.07] p-8 sm:p-10">
            {/* Logo (mobile only) */}
            <div className="flex lg:hidden justify-center mb-8">
              <Image src="/logo.png" alt="JengaCV" width={52} height={52} className="rounded-2xl" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1.5">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
              {isSignUp
                ? "Sign up to start building ATS-optimized CVs."
                : "Sign in to access your dashboard and saved CVs."}
            </p>

            {/* Error message */}
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800/50"
              >
                <div className="shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-500 text-xs font-bold">!</div>
                <p>{authError}</p>
              </motion.div>
            )}

            {/* Google button */}
            <button
              onClick={signInWithGoogle}
              id="google-signin-btn"
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 px-4 py-3.5 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 shadow-sm hover:shadow-md mb-6"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-slate-200 dark:bg-white/[0.08]" />
              <span className="text-xs text-slate-400 font-medium">or continue with email</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-white/[0.08]" />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input pr-12"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="submit-auth-btn"
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign In"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setIsSignUp(!isSignUp); setAuthError(""); }}
                className="text-sm text-primary hover:text-primary-light font-medium hover:underline underline-offset-2 transition-colors"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400 leading-relaxed px-4">
            By continuing, you agree to our{" "}
            <span className="text-slate-600 dark:text-slate-300 hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
            {" "}and{" "}
            <span className="text-slate-600 dark:text-slate-300 hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
