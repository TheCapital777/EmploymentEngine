"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, FileText, Send, Loader2, UploadCloud, CheckCircle2, AlertCircle, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useDictionary } from "../../../context/DictionaryContext";
import { db } from "../../../lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { parsePdfDocument, processInterviewStep } from "../../actions";
import Link from "next/link";

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  evaluation?: { score: number; feedback: string };
}

export default function InterviewPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const { lang } = useDictionary();
  const router = useRouter();

  const [cvs, setCvs] = useState<any[]>([]);
  const [selectedCv, setSelectedCv] = useState<any | null>(null);
  const [uploadedFileText, setUploadedFileText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuestionCount, setCurrentQuestionCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isPremium = userData?.premiumUntil ? Date.now() < userData.premiumUntil : false;
  const maxQuestions = isPremium ? 20 : 3;

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    const fetchCVs = async () => {
      try {
        const q = query(collection(db, "cvs"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const cvData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        cvData.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setCvs(cvData);
      } catch (e) { console.error(e); }
    };
    fetchCVs();
  }, [user, authLoading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isProcessing]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = (event.target?.result as string).split(",")[1];
        if (file.type === "application/pdf") {
          const res = await parsePdfDocument(base64Data);
          if (res.success && res.text) { setUploadedFileText(res.text); setSelectedCv(null); }
          else alert("Failed to parse PDF.");
        } else if (file.type === "text/plain") {
          setUploadedFileText(atob(base64Data)); setSelectedCv(null);
        } else {
          alert("Unsupported file type. Please upload a PDF or TXT.");
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch { setIsUploading(false); }
  };

  const startInterview = async () => {
    const sourceText = uploadedFileText || (selectedCv ? JSON.stringify(selectedCv.data) : null);
    if (!sourceText) return;
    setIsInterviewStarted(true);
    setIsProcessing(true);
    try {
      const res = await processInterviewStep(sourceText, [], false);
      if (res.success && res.data?.nextQuestion) {
        setChatHistory([{ role: "ai", text: res.data.nextQuestion }]);
        setCurrentQuestionCount(1);
      } else {
        alert("Failed to start interview."); setIsInterviewStarted(false);
      }
    } catch { setIsInterviewStarted(false); }
    finally { setIsProcessing(false); }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isProcessing) return;
    const newHistory = [...chatHistory, { role: "user" as const, text: userInput }];
    setChatHistory(newHistory);
    setUserInput("");
    setIsProcessing(true);
    const sourceText = uploadedFileText || (selectedCv ? JSON.stringify(selectedCv.data) : "");
    const willBeComplete = currentQuestionCount >= maxQuestions;
    try {
      const res = await processInterviewStep(sourceText, newHistory, willBeComplete);
      if (res.success && res.data) {
        setChatHistory((prev) => [...prev, {
          role: "ai",
          text: res.data.nextQuestion || "Thank you. That concludes our interview session.",
          evaluation: res.data.evaluation,
        }]);
        if (willBeComplete) setIsComplete(true);
        else setCurrentQuestionCount((p) => p + 1);
      }
    } catch (e) { console.error(e); }
    finally { setIsProcessing(false); }
  };

  if (authLoading) return null;

  const progressPct = Math.round((currentQuestionCount / maxQuestions) * 100);

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 flex flex-col" style={{ minHeight: "calc(100vh - 68px)" }}>
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl py-8 flex flex-col flex-1">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mic className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                AI Interview Simulator
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm ml-11">
              Practice real interview questions based on your profile.
            </p>
          </div>
          <Link
            href={`/${lang}/dashboard`}
            id="interview-back-btn"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary transition-colors px-3 py-2 rounded-xl hover:bg-primary/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>

        {!isInterviewStarted ? (
          /* ══════ SETUP VIEW ══════ */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/[0.07] rounded-3xl shadow-[var(--shadow-sm)] flex-1 p-8"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Select your Interview Source
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
              Use one of your saved CVs or upload a custom document.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {/* Saved CVs */}
              <div className="border border-slate-200 dark:border-white/[0.07] rounded-2xl p-6 hover:border-primary/30 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Use Saved CV</h3>
                </div>
                {cvs.length > 0 ? (
                  <div className="space-y-2.5">
                    {cvs.map((cv) => (
                      <label
                        key={cv.id}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                          selectedCv?.id === cv.id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-slate-200 dark:border-white/[0.07] hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="cvSource"
                          className="w-4 h-4 accent-primary"
                          checked={selectedCv?.id === cv.id}
                          onChange={() => { setSelectedCv(cv); setUploadedFileText(null); setFileName(null); }}
                        />
                        <span className="font-medium text-sm text-slate-700 dark:text-slate-300 truncate">
                          {cv.title}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-3" />
                    <p className="text-sm text-slate-500">No CVs found.</p>
                    <Link href={`/${lang}/builder`} className="text-sm text-primary font-medium mt-2 hover:underline">
                      Create one first →
                    </Link>
                  </div>
                )}
              </div>

              {/* Upload */}
              <div className="relative border border-dashed border-slate-300 dark:border-white/[0.10] rounded-2xl p-6 hover:border-primary/50 transition-colors duration-200 flex flex-col items-center justify-center text-center group cursor-pointer overflow-hidden">
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-200">
                  {isUploading ? (
                    <Loader2 className="w-7 h-7 text-primary animate-spin" />
                  ) : (
                    <UploadCloud className="w-7 h-7 text-slate-400 group-hover:text-primary transition-colors duration-200" />
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5">Upload Document</h3>
                <p className="text-sm text-slate-400 mb-4">PDF or TXT resume</p>

                {fileName && !isUploading && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 px-3 py-1.5 rounded-full z-20">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="truncate max-w-[140px]">{fileName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Free plan notice */}
            {!isPremium && (
              <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 mb-8">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">Free plan: </strong>
                  Your interview will consist of <strong>{maxQuestions} questions</strong>.{" "}
                  <button
                    onClick={() => router.push(`/${lang}/pricing`)}
                    className="text-primary hover:underline font-medium"
                  >
                    Upgrade to Premium
                  </button>{" "}
                  for unlimited extended interviews.
                </p>
              </div>
            )}

            <button
              id="start-interview-btn"
              onClick={startInterview}
              disabled={(!selectedCv && !uploadedFileText) || isProcessing}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Start Interview
                </>
              )}
            </button>
          </motion.div>

        ) : (
          /* ══════ CHAT VIEW ══════ */
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/[0.07] rounded-3xl shadow-[var(--shadow-sm)] overflow-hidden flex-1"
          >
            {/* Session header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-60" />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Live Interview Session</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs font-medium text-slate-500">
                  Q{currentQuestionCount}/{maxQuestions}
                </div>
                <div className="w-24 progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <AnimatePresence initial={false}>
                {chatHistory.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 shrink-0 mt-1">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                    <div className={`max-w-[80%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      {msg.evaluation && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-3 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/40 p-4 rounded-2xl rounded-tl-sm w-full"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-amber-900 dark:text-amber-400">Coach's Evaluation</span>
                            <span className="px-2 py-0.5 bg-white dark:bg-slate-900 rounded-lg text-xs font-bold text-amber-600 border border-amber-200 dark:border-amber-800/40">
                              {msg.evaluation.score}/10
                            </span>
                          </div>
                          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{msg.evaluation.feedback}</p>
                        </motion.div>
                      )}
                      <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-primary text-white rounded-tr-sm"
                          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/[0.07] text-slate-800 dark:text-slate-200 rounded-tl-sm"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 shrink-0 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/[0.07] flex items-center gap-1.5">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-white/[0.06] bg-white dark:bg-slate-900 shrink-0">
              {isComplete ? (
                <div className="text-center py-3">
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                    🎉 Interview complete! Great work.
                  </p>
                  <Link
                    href={`/${lang}/dashboard`}
                    className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-end gap-3">
                    <textarea
                      ref={textareaRef}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
                      }}
                      placeholder="Type your answer here…"
                      disabled={isProcessing}
                      className="form-input flex-1 resize-none custom-scrollbar py-3"
                      rows={2}
                    />
                    <button
                      id="send-answer-btn"
                      onClick={handleSendMessage}
                      disabled={!userInput.trim() || isProcessing}
                      className="btn-primary p-3.5 aspect-square rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-center text-slate-400 mt-2.5">
                    Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-white/[0.06] rounded text-slate-500 font-mono text-xs">Enter</kbd> to send
                    {" · "}
                    <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-white/[0.06] rounded text-slate-500 font-mono text-xs">Shift+Enter</kbd> for new line
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
