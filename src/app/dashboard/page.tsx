"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, FileSignature, Trash2, Loader2, ArrowRight, TrendingUp, Briefcase, Award, Mic, Star, AlertCircle, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../lib/firebase/config";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { analyzeProfileReadiness } from "../actions";
import InterviewPrepModal from "../../components/InterviewPrepModal";
import PaywallModal from "../../components/PaywallModal";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [cvs, setCvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiStats, setAiStats] = useState<{score: number, suggestions: string[]} | null>(null);
  const [analyzingStats, setAnalyzingStats] = useState(false);
  const [prepModalOpen, setPrepModalOpen] = useState(false);
  const [selectedCvForPrep, setSelectedCvForPrep] = useState<any>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    const fetchCVs = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "cvs"), 
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const cvData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];
        
        cvData.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        
        setCvs(cvData);

        if (cvData.length > 0) {
          setAnalyzingStats(true);
          const aiResult = await analyzeProfileReadiness(cvData[0].data);
          if (aiResult.success) {
            setAiStats(aiResult.data);
          }
          setAnalyzingStats(false);
        }
      } catch (e) {
        console.error("Error fetching CVs:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCVs();
  }, [user, authLoading]);

  const handleDeleteCV = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this CV? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "cvs", id));
        setCvs(prev => prev.filter(cv => cv.id !== id));
      } catch (err) {
        console.error("Error deleting CV:", err);
        alert("Failed to delete CV.");
      }
    }
  };

  const handleOpenPrep = (e: React.MouseEvent, cvData: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCvForPrep(cvData);
    setPrepModalOpen(true);
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div className="w-full max-w-md">
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 mb-3 animate-pulse"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2 animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-12 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
              <div className="h-12 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
              <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
            </div>
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3 mb-3 animate-pulse"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-32 mb-6 animate-pulse"></div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 h-48 flex flex-col animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                  <div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                </div>
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2 mt-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome Back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Here's a summary of your employability profile.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setPaywallOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-medium shadow-md shadow-amber-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <Star className="w-5 h-5" />
              Upgrade to Pro
            </button>
            <Link href="/cover-letter" className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-medium shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              <FileText className="w-5 h-5" />
              Cover Letter
            </Link>
            <Link href="/builder" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
              <Plus className="w-5 h-5" />
              Create New CV
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-xl">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Profile Readiness</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {analyzingStats ? (
                  <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mt-1"></div>
                ) : (
                  `${aiStats?.score || 0}%`
                )}
              </h3>
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Generated CVs</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{cvs.length}</h3>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Suggested Improvements</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {analyzingStats ? (
                  <div className="h-8 w-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mt-1"></div>
                ) : (
                  `${aiStats?.suggestions?.length || 0}`
                )}
              </h3>
            </div>
          </div>
        </div>

        {aiStats && aiStats.suggestions?.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-10">
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-500 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              AI Suggestions to Improve Your Score
            </h3>
            <ul className="list-disc list-inside space-y-2 text-amber-800 dark:text-amber-400 text-sm">
              {aiStats.suggestions.map((suggestion, idx) => (
                <li key={idx}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent CVs</h2>
        
        {cvs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-primary to-blue-600 opacity-50"></div>
            <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center justify-center mb-5 ring-8 ring-primary/5">
              <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No CVs yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 text-base">You haven't built any CVs yet. Stand out to employers by creating your first ATS-optimized CV in minutes.</p>
            <Link href="/builder" className="group inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-xl font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Build My CV Now
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv) => (
              <Link href={`/builder?id=${cv.id}`} key={cv.id} className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 group cursor-pointer flex flex-col block">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-primary/10 transition-colors">
                    <FileText className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">ATS Score: 85%</span>
                    <button 
                      onClick={(e) => handleOpenPrep(e, cv.data)}
                      className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors mr-1"
                      title="AI Interview Prep"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteCV(e, cv.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                      title="Delete CV"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">{cv.title}</h3>
                <div className="flex items-center justify-between mt-auto pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>{cv.createdAt ? new Date(cv.createdAt.toMillis()).toLocaleDateString() : 'Just now'}</span>
                  </div>
                  <span className="text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Edit CV</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <InterviewPrepModal 
        cvData={selectedCvForPrep} 
        isOpen={prepModalOpen} 
        onClose={() => setPrepModalOpen(false)} 
      />

      <PaywallModal 
        isOpen={paywallOpen} 
        onClose={() => setPaywallOpen(false)} 
        featureName="Pro Plan"
      />
    </div>
  );
}
