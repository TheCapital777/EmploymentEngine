"use client";

import { X, Lock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PaywallModal({ isOpen, onClose, featureName }: { isOpen: boolean, onClose: () => void, featureName: string }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md overflow-hidden flex flex-col rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-500" />
                Unlock Pro Features
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {featureName ? `${featureName} is a Pro feature` : 'Upgrade to Pro'}
                </h3>
                <p className="text-slate-500 text-sm">
                  Upgrade to our Pro plan to access premium features and supercharge your job search.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Unlimited AI Cover Letters</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Extended AI Interviews & Custom Uploads</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Premium CV Templates (Executive & Minimalist)</span>
                </div>
              </div>

              <a 
                href="https://snippe.me/pay/your-payment-link-here" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Pay with Snippe (TZS 10,000)
              </a>
              <p className="text-center text-xs text-slate-400 mt-4">
                Payments securely processed by Snippe.sh via M-Pesa, Airtel Money, Halopesa or Card.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
