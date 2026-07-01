"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Target, Award, Sparkles, Star, Mic, TrendingUp, Shield, Zap, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDictionary } from "../../context/DictionaryContext";
import { useState, useEffect } from "react";

/* ─── Framer variants ──────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const STATS = [
  { value: "40K+", label: "Graduates Served" },
  { value: "94%", label: "Interview Rate" },
  { value: "3 min", label: "Avg. Build Time" },
  { value: "#1", label: "in Tanzania" },
];

const TRUST_LOGOS = [
  { src: "/logos/crdb.png", alt: "CRDB Bank", w: 160, h: 48 },
  { src: "/logos/voda.png", alt: "Vodacom", w: 160, h: 48 },
  { src: "/logos/nmb.png",  alt: "NMB Bank", w: 160, h: 48 },
  { src: "/logos/mix.png",  alt: "Partner",  w: 160, h: 48 },
];

const FEATURE_ICONS = [
  <FileText key="1" className="w-7 h-7" />,
  <Target   key="2" className="w-7 h-7" />,
  <Award    key="3" className="w-7 h-7" />,
];

const ICON_COLORS = [
  "text-primary bg-primary/10",
  "text-sky-500 bg-sky-100 dark:bg-sky-900/30",
  "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
];

export default function Home() {
  const { dict, lang } = useDictionary();
  const [imgIdx, setImgIdx] = useState(0);

  const heroImages = [
    "/hero_cv_1.png",
    "/hero_cv_2.png",
    "/hero_cv_3.png",
    "/hero_cv_4.png",
    "/hero_cv_5.png",
  ];

  useEffect(() => {
    const t = setInterval(() => setImgIdx((p) => (p + 1) % heroImages.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col w-full">

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[calc(100vh-68px)] flex items-center py-20 lg:py-28">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px]" />
        {/* Fade edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(248,250,252,0.8)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,23,0.8)_100%)]" />

        <div className="container relative mx-auto px-4 sm:px-6 z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

            {/* ── LEFT ── */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">

              {/* Pill badge */}
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 relative overflow-hidden group cursor-default select-none"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 24px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 relative z-10">
                  Tanzania's #1 AI CV Builder
                </span>
                <span className="relative z-10 px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  NEW
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                custom={0.1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-2xl mb-6 leading-[1.08]"
              >
                {lang === "en" ? (
                  <>
                    Land Your Dream Job<br className="hidden sm:block" />
                    <span className="gradient-text"> in Tanzania</span>
                  </>
                ) : (
                  <>
                    Pata Kazi ya Ndoto Yako<br className="hidden sm:block" />
                    <span className="gradient-text"> Tanzania</span>
                  </>
                )}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                custom={0.2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-xl mb-10 leading-relaxed"
              >
                {dict.home.heroSubtitle}
              </motion.p>

              {/* CTAs */}
              <motion.div
                custom={0.3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start"
              >
                <Link
                  href={`/${lang}/builder`}
                  id="hero-cta-build"
                  className="group relative overflow-hidden w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl text-sm sm:text-base font-semibold shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-lg)] hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {dict.home.startBuildingNow}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-primary bg-[length:200%] group-hover:bg-right transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 z-[1]" />
                </Link>

                <Link
                  href={`/${lang}/interview`}
                  id="hero-cta-interview"
                  className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 backdrop-blur-sm hover:bg-white dark:hover:bg-white/[0.10] hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-hover:text-primary transition-colors" />
                  Practice Interview
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                custom={0.4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-6 mt-8"
              >
                <div className="flex -space-x-2">
                  {["bg-blue-400","bg-emerald-400","bg-violet-400","bg-amber-400"].map((c, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-xs font-bold`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">40,000+</span> graduates trust JengaCV
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT — Floating CV Card ── */}
            <div className="flex-1 w-full flex items-center justify-center lg:justify-end relative min-h-[500px]">
              {/* Ambient glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-primary/20 via-accent/10 to-transparent blur-[80px] dark:from-primary/30" />
              </div>

              {/* Main CV card */}
              <motion.div
                className="relative w-full max-w-[380px] aspect-[1/1.414]"
                initial={{ opacity: 0, rotateY: -12, rotateX: 4, y: 40 }}
                animate={{
                  opacity: 1,
                  rotateY: [-4, 4, -4],
                  rotateX: [2, 6, 2],
                  y: [0, -16, 0],
                }}
                transition={{
                  opacity: { duration: 0.8 },
                  rotateY: { repeat: Infinity, duration: 7, ease: "easeInOut" },
                  rotateX: { repeat: Infinity, duration: 5.5, ease: "easeInOut" },
                  y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
                }}
                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
              >
                <div className="w-full h-full rounded-3xl overflow-hidden border border-white/40 dark:border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.15),0_8px_24px_rgba(59,130,246,0.12)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_8px_24px_rgba(59,130,246,0.2)]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={imgIdx}
                      src={heroImages[imgIdx]}
                      alt="Professional CV Preview"
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7 }}
                    />
                  </AnimatePresence>
                  {/* Gloss overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating chip — ATS */}
                <motion.div
                  className="absolute -right-8 top-20 glass px-4 py-3 rounded-2xl flex items-center gap-3 z-20"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.8 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none mb-0.5">Status</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">ATS Optimized ✓</p>
                  </div>
                </motion.div>

                {/* Floating chip — Hired */}
                <motion.div
                  className="absolute -left-8 bottom-28 glass px-4 py-3 rounded-2xl flex items-center gap-3 z-20"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.3 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none mb-0.5">Success Rate</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">94% Hired Faster</p>
                  </div>
                </motion.div>

                {/* Image indicator dots */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {heroImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === imgIdx ? "w-6 bg-primary" : "w-1.5 bg-slate-300 dark:bg-slate-700"}`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── Stats Strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                className="relative text-center px-4 py-5 rounded-2xl bg-white/70 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] backdrop-blur-sm"
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white gradient-text">
                  {s.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade to next section */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none z-10" />
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════ */}
      <section id="features" className="relative py-28 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

        {/* Ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: -24, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="badge-primary mx-auto mb-4 text-sm"
            >
              <Zap className="w-4 h-4" />
              Why JengaCV
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: -32, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight"
            >
              {dict.home.whyChoose}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              {dict.home.whyChooseSubtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {dict.home.features.map((feature, i) => {
              const colSpan = i === 0 ? "md:col-span-4" : i === 1 ? "md:col-span-2" : "md:col-span-6";

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative overflow-hidden rounded-3xl p-8 border border-slate-100 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.03] hover:border-primary/30 dark:hover:border-primary/30 hover:bg-white dark:hover:bg-white/[0.05] transition-all duration-300 hover:shadow-[var(--shadow-md)] ${colSpan}`}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-br-3xl" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${ICON_COLORS[i]} group-hover:scale-110 transition-transform duration-300`}>
                      {FEATURE_ICONS[i]}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-200">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base sm:text-lg flex-1">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS (new premium section)
      ══════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="relative py-28 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: -24, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="badge bg-white/10 text-white/80 border border-white/10 mx-auto mb-4"
            >
              <Sparkles className="w-4 h-4" />
              Simple Process
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: -32, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4"
            >
              From blank page to hired<br />
              <span className="gradient-text">in 3 minutes</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { num: "01", icon: <FileText className="w-7 h-7" />, title: "Fill Your Details", desc: "Answer simple questions about your experience, skills, and education — in English or Swahili." },
              { num: "02", icon: <Zap className="w-7 h-7" />, title: "AI Builds Your CV", desc: "Our AI crafts an ATS-optimized CV tailored to Tanzania's top employers and formats." },
              { num: "03", icon: <Award className="w-7 h-7" />, title: "Download & Apply", desc: "Export a professional PDF and start applying immediately. Practice interviews with our AI coach." },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative group"
              >
                <div className="relative p-8 rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-primary/40 transition-all duration-300">
                  {/* Step number */}
                  <div className="text-7xl font-black text-white/[0.04] absolute -top-2 -right-2 select-none leading-none">
                    {step.num}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
                {/* Connector arrow */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-10 text-slate-700">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href={`/${lang}/builder`}
              id="how-it-works-cta"
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4"
            >
              Start Building Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SOCIAL PROOF / LOGOS
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-20 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -24, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center mb-12"
          >
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Trusted by graduates heading to
            </p>
          </motion.div>

          {/* Logo marquee */}
          <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:w-24 before:h-full before:bg-gradient-to-r before:from-white before:to-transparent before:z-10 dark:before:from-slate-950 after:absolute after:right-0 after:top-0 after:w-24 after:h-full after:bg-gradient-to-l after:from-white after:to-transparent after:z-10 dark:after:from-slate-950">
            <motion.div
              className="flex items-center gap-16 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            >
              {[...Array(2)].map((_, arrIdx) => (
                <div key={arrIdx} className="flex gap-16 items-center">
                  {TRUST_LOGOS.map((logo, i) => (
                    <div
                      key={`${arrIdx}-${i}`}
                      className="relative opacity-50 hover:opacity-90 transition-all duration-300 grayscale hover:grayscale-0 shrink-0 w-40 md:w-48 h-16 md:h-20"
                    >
                      <Image src={logo.src} alt={logo.alt} fill sizes="(max-width: 768px) 160px, 192px" className="object-contain" />
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA teaser */}
        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="container mx-auto px-4 sm:px-6 mt-20"
        >
          <div className="relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center"
            style={{
              background: "linear-gradient(135deg, #1e40af 0%, #0284c7 50%, #1e40af 100%)",
              backgroundSize: "200% auto",
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="relative z-10">
              <Users className="w-10 h-10 text-white/70 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4">
                Ready to stand out?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of Tanzanian graduates who built their careers with JengaCV.
              </p>
              <Link
                href={`/${lang}/builder`}
                id="bottom-cta-build"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
              >
                Build My CV — It's Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
