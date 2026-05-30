"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { generateCoverLetter } from "../../actions";
import { Loader2, Send, Copy, Check } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

export default function CoverLetterPage() {
  const { user, loading: authLoading } = useAuth();
  const [cvs, setCvs] = useState<any[]>([]);
  const [selectedCv, setSelectedCv] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    const fetchCVs = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, "cvs"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const cvData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        cvData.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setCvs(cvData);
        if (cvData.length > 0) {
          setSelectedCv(cvData[0]);
        }
      } catch (e) {
        console.error("Error fetching CVs:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCVs();
  }, [user, authLoading]);

  const handleGenerate = async () => {
    if (!selectedCv || !jobDescription.trim()) return;
    setGenerating(true);
    setCoverLetter("");
    const toastId = toast.loading("Generating Cover Letter...");
    try {
      const res = await generateCoverLetter(selectedCv.data, jobDescription);
      if (res.success && res.text) {
        setCoverLetter(res.text);
        toast.success("Cover letter generated!", { id: toastId });
      } else {
        toast.error(res.error || "Failed to generate cover letter.", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("Error generating cover letter.", { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Please log in to use this feature</h2>
        <Link href="/login" className="px-6 py-3 bg-primary text-white rounded-xl shadow-md hover:-translate-y-0.5 transition-all">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">AI Cover Letter Generator ✉️</h1>
          <p className="text-slate-600 dark:text-slate-400">Instantly generate a tailored cover letter using your CV and the job description.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/40 dark:shadow-none">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Select your CV</label>
              {cvs.length === 0 ? (
                <div className="text-sm text-slate-500 mb-4">You have no saved CVs. Please build one first.</div>
              ) : (
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 mb-6 outline-none focus:ring-2 focus:ring-primary"
                  value={selectedCv?.id || ""}
                  onChange={(e) => {
                    const cv = cvs.find(c => c.id === e.target.value);
                    if (cv) setSelectedCv(cv);
                  }}
                >
                  {cvs.map(cv => (
                    <option key={cv.id} value={cv.id}>{cv.title || "Untitled CV"}</option>
                  ))}
                </select>
              )}

              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Paste Job Description</label>
              <textarea 
                className="w-full p-4 h-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                placeholder="Paste the requirements, role responsibilities, and company details here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />

              <button 
                onClick={handleGenerate}
                disabled={generating || !selectedCv || !jobDescription.trim()}
                className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium shadow-md shadow-primary/20 hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {generating ? "Writing Letter..." : "Generate Cover Letter"}
              </button>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col h-[650px]">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white">Your Cover Letter</label>
              {coverLetter && (
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-lg"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Text"}
                </button>
              )}
            </div>
            
            {generating ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p>Gemini is writing your cover letter...</p>
              </div>
            ) : coverLetter ? (
              <div className="flex-1 w-full p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                <ReactMarkdown 
                  components={{
                    p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-slate-900 dark:text-white" {...props} />,
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-4 mt-6 text-slate-900 dark:text-white" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-3 mt-5 text-slate-900 dark:text-white" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="text-slate-700 dark:text-slate-300" {...props} />
                  }}
                >
                  {coverLetter}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/50">
                <Send className="w-10 h-10 opacity-30" />
                <p className="text-sm opacity-60">Your generated letter will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
