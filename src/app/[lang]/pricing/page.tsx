"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { Check, Star, Loader2 } from "lucide-react";
import { createSnippeSession } from "../../actions";
import { motion } from "framer-motion";

export default function PricingPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPremium = userData?.premiumUntil && userData.premiumUntil > Date.now();

  const handleUpgrade = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const result = await createSnippeSession(user.uid);
      if (result.success && result.url) {
        window.location.href = result.url; // Redirect to Snippe
      } else {
        setError(result.error || "Failed to initiate payment session.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Invest in your career with our premium tools designed for the East African job market.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Free Tier */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Free</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">0 TZS</span>
              <span className="text-slate-500">/ forever</span>
            </div>
            <p className="text-slate-500 mt-2">Get started with the basics.</p>
          </div>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <Check className="w-5 h-5 text-primary shrink-0" />
              <span>1 Standard CV Build</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <Check className="w-5 h-5 text-primary shrink-0" />
              <span>1 Interview Simulator Session</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <Check className="w-5 h-5 text-primary shrink-0" />
              <span>Basic PDF Export</span>
            </li>
          </ul>

          <button 
            disabled
            className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 bg-slate-50 dark:bg-slate-950 font-medium"
          >
            Current Plan
          </button>
        </motion.div>

        {/* Premium Tier */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-primary shadow-xl shadow-primary/10 overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-primary mb-2 flex items-center gap-2">
              Premium <Star className="w-5 h-5 fill-primary" />
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">10,000 TZS</span>
              <span className="text-slate-500">/ 30 Days</span>
            </div>
            <p className="text-slate-500 mt-2">Everything you need to land the job.</p>
          </div>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <Check className="w-5 h-5 text-primary shrink-0" />
              <span className="font-medium text-slate-900 dark:text-white">Unlimited CV Builds & Edits</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <Check className="w-5 h-5 text-primary shrink-0" />
              <span className="font-medium text-slate-900 dark:text-white">Unlimited Interview Uploads & Sessions</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <Check className="w-5 h-5 text-primary shrink-0" />
              <span>Premium Templates</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <Check className="w-5 h-5 text-primary shrink-0" />
              <span>AI Cover Letter Generation</span>
            </li>
          </ul>

          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {isPremium ? (
            <button 
              disabled
              className="w-full py-3 rounded-xl bg-green-500 text-white font-medium flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> Active Subscription
            </button>
          ) : (
            <button 
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-white font-medium shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upgrade to Premium"}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
