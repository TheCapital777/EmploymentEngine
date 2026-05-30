"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, FileText, Send, Loader2, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useDictionary } from "../../../context/DictionaryContext";
import { db } from "../../../lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { parsePdfDocument, processInterviewStep } from "../../actions";
import Link from "next/link";

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  evaluation?: {
    score: number;
    feedback: string;
  };
}

export default function InterviewPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const { lang } = useDictionary();
  const router = useRouter();
  
  // Setup State
  const [cvs, setCvs] = useState<any[]>([]);
  const [selectedCv, setSelectedCv] = useState<any | null>(null);
  const [uploadedFileText, setUploadedFileText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Interview State
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuestionCount, setCurrentQuestionCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isPremium = userData?.premiumUntil ? Date.now() < userData.premiumUntil : false;
  const maxQuestions = isPremium ? 20 : 3;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchCVs = async () => {
      try {
        const q = query(collection(db, "cvs"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const cvData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        cvData.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setCvs(cvData);
      } catch (e) {
        console.error("Error fetching CVs:", e);
      }
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
        const base64Data = (event.target?.result as string).split(',')[1];
        
        if (file.type === 'application/pdf') {
          const res = await parsePdfDocument(base64Data);
          if (res.success && res.text) {
            setUploadedFileText(res.text);
            setSelectedCv(null); // Clear CV selection if file is uploaded
          } else {
            alert("Failed to parse PDF.");
          }
        } else if (file.type === 'text/plain') {
          // Direct text decode
          const text = atob(base64Data);
          setUploadedFileText(text);
          setSelectedCv(null);
        } else {
          alert("Unsupported file type. Please upload a PDF or TXT.");
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload Error:", error);
      setIsUploading(false);
    }
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
        alert("Failed to start interview.");
        setIsInterviewStarted(false);
      }
    } catch (error) {
      console.error("Interview Start Error:", error);
      setIsInterviewStarted(false);
    } finally {
      setIsProcessing(false);
    }
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
        
        const aiMessage: ChatMessage = {
          role: "ai",
          text: res.data.nextQuestion || "Thank you. That concludes our interview session.",
          evaluation: res.data.evaluation
        };

        setChatHistory(prev => [...prev, aiMessage]);
        
        if (willBeComplete) {
          setIsComplete(true);
        } else {
          setCurrentQuestionCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl flex flex-col h-[calc(100vh-100px)]">
        
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Mic className="w-8 h-8 text-primary" />
              AI Interview Simulator
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Practice real interview questions based on your profile.</p>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">
            Back to Dashboard
          </Link>
        </div>

        {!isInterviewStarted ? (
          // SETUP VIEW
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm flex-1"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Select your Interview Source</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Left: Saved CVs */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Use Saved CV</h3>
                </div>
                
                {cvs.length > 0 ? (
                  <div className="space-y-3">
                    {cvs.map(cv => (
                      <label key={cv.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedCv?.id === cv.id ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                        <input 
                          type="radio" 
                          name="cvSource" 
                          className="w-4 h-4 text-primary" 
                          checked={selectedCv?.id === cv.id}
                          onChange={() => {
                            setSelectedCv(cv);
                            setUploadedFileText(null);
                            setFileName(null);
                          }}
                        />
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{cv.title}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No CVs found. Create one first!</p>
                )}
              </div>

              {/* Right: Upload Doc */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-primary/50 transition-colors flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <input 
                  type="file" 
                  accept=".pdf,.txt" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Upload Custom Document</h3>
                <p className="text-sm text-slate-500 mb-4">Upload a PDF or TXT resume to be interviewed on.</p>
                
                {isUploading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                {fileName && !isUploading && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="truncate max-w-[150px]">{fileName}</span>
                  </div>
                )}
              </div>
            </div>

            {!isPremium && (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex items-start gap-3 mb-8">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">Current Limit:</strong> You are on the free plan. Your interview will consist of {maxQuestions} questions. 
                  <button onClick={() => router.push(`/${lang}/pricing`)} className="text-primary hover:underline ml-1 font-medium">Upgrade to Premium</button> for unlimited extended interviews.
                </div>
              </div>
            )}

            <button 
              onClick={startInterview}
              disabled={(!selectedCv && !uploadedFileText) || isProcessing}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Start Interview"}
            </button>
          </motion.div>
        ) : (
          // CHAT INTERVIEW VIEW
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex-1"
          >
            {/* Header Status */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Live Interview Session</span>
              </div>
              <div className="text-sm font-medium text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                Question {currentQuestionCount} of {maxQuestions}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 shrink-0 mt-1">
                      <Mic className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    
                    {msg.evaluation && (
                      <div className="mb-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl rounded-tl-sm w-full shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-amber-900 dark:text-amber-500">Coach's Evaluation</span>
                          <span className="px-2 py-0.5 bg-white dark:bg-slate-900 rounded-md text-xs font-bold text-amber-600 border border-amber-200 dark:border-amber-800">
                            {msg.evaluation.score}/10
                          </span>
                        </div>
                        <p className="text-sm text-amber-800 dark:text-amber-400 leading-relaxed">{msg.evaluation.feedback}</p>
                      </div>
                    )}

                    <div className={`px-5 py-3.5 rounded-2xl shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 shrink-0 mt-1">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div className="relative flex items-end gap-2">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={isComplete ? "Interview finished." : "Type your answer here..."}
                  disabled={isProcessing || isComplete}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none custom-scrollbar"
                  rows={2}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isProcessing || isComplete}
                  className="p-3 bg-primary text-white rounded-xl shadow-sm hover:shadow-md disabled:opacity-50 disabled:hover:shadow-sm transition-all mb-0.5"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-center text-xs text-slate-400 mt-2">Press Enter to send, Shift+Enter for new line.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
