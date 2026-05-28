"use client";

import { useState, useEffect } from "react";
import { generateInterviewPrep } from "../app/actions";
import { Loader2, X, Mic, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PrepItem {
  question: string;
  tip: string;
}

export default function InterviewPrepModal({ cvData, isOpen, onClose }: { cvData: any, isOpen: boolean, onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [prepData, setPrepData] = useState<PrepItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && cvData) {
      setLoading(true);
      setError("");
      generateInterviewPrep(cvData).then(res => {
        if (res.success && res.data) {
          setPrepData(res.data);
        } else {
          setError(res.error || "Failed to load prep data.");
        }
      }).catch(e => {
        setError("Error generating prep data.");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [isOpen, cvData]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mic className="w-6 h-6 text-primary" />
                AI Interview Prep
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p>Gemini is preparing your custom interview questions...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
              ) : (
                <div className="space-y-6">
                  <p className="text-slate-600 dark:text-slate-400 mb-6">Based on your CV, here are 5 questions employers are likely to ask you, along with tips on how to answer them.</p>
                  {prepData.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Q{idx + 1}. {item.question}</h3>
                      <div className="flex items-start gap-3 text-sm text-primary">
                        <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="leading-relaxed"><strong className="font-semibold">Coach's Tip:</strong> {item.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
