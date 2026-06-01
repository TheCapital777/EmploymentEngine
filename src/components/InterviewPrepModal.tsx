"use client";

import { useState, useEffect } from "react";
import { generateInterviewPrep } from "../app/actions";
import { Loader2, X, Mic, Lightbulb, AlertCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PrepItem {
  question: string;
  tip: string;
}

export default function InterviewPrepModal({
  cvData,
  isOpen,
  onClose,
}: {
  cvData: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [prepData, setPrepData] = useState<PrepItem[]>([]);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && cvData) {
      setLoading(true);
      setError("");
      setExpanded(null);
      generateInterviewPrep(cvData)
        .then((res) => {
          if (res.success && res.data) {
            setPrepData(res.data);
          } else {
            setError(res.error || "Failed to load prep data.");
          }
        })
        .catch(() => setError("Error generating prep data."))
        .finally(() => setLoading(false));
    }
  }, [isOpen, cvData]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="interview-prep-overlay"
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
            className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl shadow-[var(--shadow-xl)] border border-slate-200/60 dark:border-white/[0.07] overflow-hidden"
          >
            {/* Top bar */}
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%] animate-[gradientShift_3s_linear_infinite] shrink-0" />

            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-none mb-0.5">
                    AI Interview Prep
                  </h2>
                  {!loading && prepData.length > 0 && (
                    <p className="text-xs text-slate-400 font-medium">{prepData.length} questions generated</p>
                  )}
                </div>
              </div>
              <button
                id="interview-prep-close-btn"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Mic className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Generating your questions…</p>
                    <p className="text-sm text-slate-400">Gemini is analyzing your CV</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Something went wrong</p>
                  <p className="text-sm text-slate-400 max-w-xs">{error}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                    Based on your CV, here are questions employers are likely to ask — with coaching tips to help you shine.
                  </p>

                  {prepData.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06, duration: 0.35 }}
                      className="border border-slate-100 dark:border-white/[0.07] rounded-2xl overflow-hidden hover:border-primary/30 transition-colors duration-200"
                    >
                      {/* Question row — clickable to expand */}
                      <button
                        onClick={() => setExpanded(expanded === idx ? null : idx)}
                        className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors duration-200"
                      >
                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                          Q{idx + 1}
                        </div>
                        <p className="flex-1 font-semibold text-slate-900 dark:text-white text-sm leading-snug">
                          {item.question}
                        </p>
                        <ChevronRight
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${expanded === idx ? "rotate-90" : ""}`}
                        />
                      </button>

                      {/* Tip — collapsible */}
                      <AnimatePresence initial={false}>
                        {expanded === idx && (
                          <motion.div
                            key="tip"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5">
                              <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4">
                                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                                  <span className="font-semibold">Coach's Tip: </span>
                                  {item.tip}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
