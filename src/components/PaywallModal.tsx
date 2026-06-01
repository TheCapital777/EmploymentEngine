"use client";

import { X, Lock, CheckCircle2, Crown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const PRO_PERKS = [
  "Unlimited AI Cover Letters",
  "Extended AI Interviews & Custom Uploads",
  "Premium CV Templates (Executive & Minimalist)",
  "Priority Email Support",
];

export default function PaywallModal({
  isOpen,
  onClose,
  featureName,
}: {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="paywall-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(2, 6, 23, 0.6)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-[var(--shadow-xl)] border border-slate-200/60 dark:border-white/[0.07] overflow-hidden"
          >
            {/* Top gradient bar */}
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%] animate-[gradientShift_3s_linear_infinite]" />

            {/* Header */}
            <div className="px-7 pt-6 pb-5 flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Unlock Pro Features
                </h2>
              </div>
              <button
                id="paywall-close-btn"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-7 py-6">
              {/* Icon + message */}
              <div className="flex flex-col items-center text-center mb-7">
                <div className="relative mb-5">
                  <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-amber-500" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-amber-100 dark:border-amber-900/30 animate-ping opacity-30" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {featureName ? `${featureName} is a Pro feature` : "Upgrade to Pro"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                  Unlock all premium features and supercharge your job search in Tanzania.
                </p>
              </div>

              {/* Perks list */}
              <ul className="space-y-3 mb-7">
                {PRO_PERKS.map((perk, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{perk}</span>
                  </li>
                ))}
              </ul>

              {/* Price + CTA */}
              <div className="bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Premium Plan</p>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      10,000 <span className="text-base font-semibold text-slate-400">TZS</span>
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <p>Per 30 days</p>
                    <p>Cancel anytime</p>
                  </div>
                </div>

                <a
                  id="paywall-upgrade-btn"
                  href="https://snippe.me/pay/your-payment-link-here"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                >
                  <Crown className="w-4 h-4" />
                  Pay with Snippe
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <p className="text-center text-xs text-slate-400 mt-4">
                Securely processed via M-Pesa, Airtel Money, Halopesa or Card.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
