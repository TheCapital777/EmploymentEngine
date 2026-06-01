"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { Check, Star, Loader2, Zap, Shield, Mic, FileText, Crown } from "lucide-react";
import { createSnippeSession } from "../../actions";
import { motion } from "framer-motion";

const FREE_FEATURES = [
  "1 Standard CV Build",
  "1 Interview Simulator Session (3 questions)",
  "Basic PDF Export",
];

const PRO_FEATURES = [
  { text: "Unlimited CV Builds & Edits", icon: <FileText className="w-4 h-4" /> },
  { text: "Extended AI Interviews (20 questions)", icon: <Mic className="w-4 h-4" /> },
  { text: "Premium CV Templates", icon: <Star className="w-4 h-4" /> },
  { text: "Unlimited AI Cover Letters", icon: <Zap className="w-4 h-4" /> },
  { text: "Priority Support", icon: <Shield className="w-4 h-4" /> },
];

export default function PricingPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPremium = userData?.premiumUntil && userData.premiumUntil > Date.now();

  const handleUpgrade = async () => {
    if (!user) { router.push("/login"); return; }
    setLoading(true);
    setError("");
    try {
      const result = await createSnippeSession(user.uid);
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        setError(result.error || "Failed to initiate payment session.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-slate-950 pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.2),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="badge bg-white/10 text-white/80 border border-white/10 mx-auto mb-5">
              <Crown className="w-4 h-4" />
              Simple, Transparent Pricing
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-tight">
              Invest in Your Career
            </h1>
            <p className="text-lg text-blue-200/80 max-w-xl mx-auto">
              Premium tools built for the East African job market — at a price that makes sense.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Cards — overlap the dark hero */}
      <div className="container mx-auto px-4 sm:px-6 -mt-16 pb-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

          {/* Free card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-white/[0.07] shadow-[var(--shadow-md)] flex flex-col"
          >
            <div className="mb-8">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Free</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">0</span>
                <span className="text-2xl font-bold text-slate-400 mb-1">TZS</span>
              </div>
              <p className="text-slate-400 text-sm">Free forever — no credit card needed</p>
            </div>

            <ul className="space-y-3.5 mb-8 flex-1">
              {FREE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>

            <button
              disabled
              className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-white/[0.07] text-slate-400 bg-slate-50 dark:bg-white/[0.03] font-medium text-sm cursor-default"
            >
              Current Plan
            </button>
          </motion.div>

          {/* Premium card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-primary shadow-[var(--shadow-primary-lg)] flex flex-col overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none rounded-tl-3xl" />

            {/* Badge */}
            <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-sm">
              <Star className="w-3 h-3 fill-white" />
              BEST VALUE
            </div>

            <div className="mb-8 relative z-10">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Premium</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">10,000</span>
                <span className="text-2xl font-bold text-slate-400 mb-1">TZS</span>
              </div>
              <p className="text-slate-400 text-sm">Per 30 days · cancel anytime</p>
            </div>

            <ul className="space-y-3.5 mb-8 flex-1 relative z-10">
              {PRO_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    {f.icon}
                  </div>
                  <span className="text-sm font-medium">{f.text}</span>
                </li>
              ))}
            </ul>

            {error && (
              <p className="mb-4 text-red-500 text-sm text-center relative z-10">{error}</p>
            )}

            {isPremium ? (
              <button
                disabled
                className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 text-sm relative z-10"
              >
                <Check className="w-5 h-5" />
                Active Subscription
              </button>
            ) : (
              <button
                id="upgrade-btn"
                onClick={handleUpgrade}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base relative z-10"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    Upgrade to Premium
                  </>
                )}
              </button>
            )}

            <p className="text-xs text-center text-slate-400 mt-4 relative z-10">
              Securely processed via M-Pesa, Airtel Money, Halopesa or Card.
            </p>
          </motion.div>
        </div>

        {/* Payment trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-slate-400 mt-10 flex items-center justify-center gap-2"
        >
          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
          All payments processed securely by Snippe.sh
        </motion.p>
      </div>
    </div>
  );
}
