"use client";

import { useState, useEffect } from "react";
import {
  FileText, Plus, Trash2, Loader2, TrendingUp, AlertCircle,
  Clock, Mic, Star, Crown, Sparkles, ArrowRight, BarChart3
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../lib/firebase/config";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { analyzeProfileReadiness } from "../../actions";
import InterviewPrepModal from "../../../components/InterviewPrepModal";
import { useDictionary } from "../../../context/DictionaryContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function Dashboard() {
  const router = useRouter();
  const { lang } = useDictionary();
  const { user, loading: authLoading } = useAuth();
  const [cvs, setCvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiStats, setAiStats] = useState<{ score: number; suggestions: string[] } | null>(null);
  const [analyzingStats, setAnalyzingStats] = useState(false);
  const [prepModalOpen, setPrepModalOpen] = useState(false);
  const [selectedCvForPrep, setSelectedCvForPrep] = useState<any>(null);

  useEffect(() => {
    if (authLoading) return;
    const fetchCVs = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const q = query(collection(db, "cvs"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const cvData = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
        cvData.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setCvs(cvData);

        if (cvData.length > 0) {
          setAnalyzingStats(true);
          const aiResult = await analyzeProfileReadiness(cvData[0].data);
          if (aiResult.success) setAiStats(aiResult.data);
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
        setCvs((prev) => prev.filter((cv) => cv.id !== id));
      } catch {
        alert("Failed to delete CV.");
      }
    }
  };

  /* ── Skeleton ───────────────────────────────────────── */
  if (authLoading || loading) {
    return (
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-10">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div>
              <div className="skeleton h-8 w-56 mb-3" />
              <div className="skeleton h-4 w-40" />
            </div>
            <div className="flex gap-3">
              <div className="skeleton h-11 w-36 rounded-xl" />
              <div className="skeleton h-11 w-36 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-28 rounded-2xl" />
            ))}
          </div>
          <div className="skeleton h-6 w-32 mb-6 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-44 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const readinessScore = aiStats?.score || 0;
  const progressColor =
    readinessScore >= 75 ? "from-emerald-400 to-emerald-500" :
    readinessScore >= 50 ? "from-amber-400 to-amber-500" :
    "from-red-400 to-red-500";

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950">
      {/* ── Dash top bar ── */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200/60 dark:border-white/[0.06]">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
                Welcome back{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""} 👋
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Here's a summary of your employability profile.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${lang}/pricing`}
                id="dashboard-upgrade-btn"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-white rounded-xl font-semibold text-sm shadow-sm shadow-amber-400/30 hover:shadow-md hover:shadow-amber-400/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Pro
              </Link>
              <Link
                href={`/${lang}/interview`}
                id="dashboard-interview-btn"
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl font-semibold text-sm shadow-sm shadow-violet-500/30 hover:shadow-md hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Mic className="w-4 h-4" />
                Practice Interview
              </Link>
              <Link
                href={`/${lang}/builder`}
                id="dashboard-create-cv-btn"
                className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
              >
                <Plus className="w-4 h-4" />
                Create New CV
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-8">

        {/* ── Stat cards ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
        >
          {/* Profile Readiness */}
          <motion.div variants={fadeUp} className="stat-card relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Profile Readiness</p>
              {analyzingStats ? (
                <div className="skeleton h-8 w-20 rounded-lg mt-1" />
              ) : (
                <>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                    {readinessScore}%
                  </h3>
                  <div className="progress-bar w-full">
                    <div className={`progress-fill bg-gradient-to-r ${progressColor}`} style={{ width: `${readinessScore}%` }} />
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Generated CVs */}
          <motion.div variants={fadeUp} className="stat-card group">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Generated CVs</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{cvs.length}</h3>
            </div>
          </motion.div>

          {/* Suggestions */}
          <motion.div variants={fadeUp} className="stat-card group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">AI Suggestions</p>
              {analyzingStats ? (
                <div className="skeleton h-8 w-12 rounded-lg mt-1" />
              ) : (
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {aiStats?.suggestions?.length || 0}
                </h3>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* ── AI Suggestions banner ── */}
        {aiStats && aiStats.suggestions?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5 mb-8"
          >
            <h3 className="text-base font-bold text-amber-900 dark:text-amber-400 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              AI Suggestions to Improve Your Score
            </h3>
            <ul className="space-y-2">
              {aiStats.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-amber-800 dark:text-amber-300">
                  <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* ── CVs grid ── */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your CVs</h2>
          {cvs.length > 0 && (
            <Link
              href={`/${lang}/builder`}
              className="text-sm text-primary font-medium hover:underline underline-offset-2 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              New CV
            </Link>
          )}
        </div>

        {cvs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-white/[0.07] rounded-3xl p-14 text-center flex flex-col items-center shadow-[var(--shadow-sm)] overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5 ring-8 ring-primary/[0.06]">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No CVs yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed">
              You haven't built any CVs yet. Stand out to employers by creating your first ATS-optimized CV in minutes.
            </p>
            <Link
              href={`/${lang}/builder`}
              id="empty-state-build-btn"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5"
            >
              <Plus className="w-5 h-5" />
              Build My CV Now
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {cvs.map((cv) => (
              <motion.div key={cv.id} variants={fadeUp}>
                <Link
                  href={`/${lang}/builder?id=${cv.id}`}
                  className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-white/[0.07] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-primary/25 dark:hover:border-primary/25 hover:-translate-y-1 transition-all duration-250 flex flex-col p-6 block"
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-400 group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-all duration-200">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="badge-primary text-xs">ATS 85%</span>
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/${lang}/interview`); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Practice Interview"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteCV(e, cv.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Delete CV"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2 relative z-10">
                    {cv.title}
                  </h3>

                  <div className="mt-auto pt-4 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {cv.createdAt
                        ? new Date(cv.createdAt.toMillis()).toLocaleDateString("en-TZ", { day: "numeric", month: "short", year: "numeric" })
                        : "Just now"}
                    </div>
                    <span className="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Edit <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <InterviewPrepModal
        cvData={selectedCvForPrep}
        isOpen={prepModalOpen}
        onClose={() => setPrepModalOpen(false)}
      />
    </div>
  );
}
