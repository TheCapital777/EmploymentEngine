"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Target, Award, Sparkles, Star, Mic } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDictionary } from "../../context/DictionaryContext";
import { useState, useEffect } from "react";

export default function Home() {
  const { dict, lang } = useDictionary();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "/hero_cv_1.png",
    "/hero_cv_2.png",
    "/hero_cv_3.png",
    "/hero_cv_4.png",
    "/hero_cv_5.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Shuffle every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            {/* Left Content */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10 w-full relative">
              {/* Subtle background glow for text area */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 backdrop-blur-md text-slate-900 dark:text-white text-sm font-semibold mb-6 shadow-xl relative overflow-hidden group hover:border-primary/50 transition-colors"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent -translate-x-[150%] animate-[shimmer_2.5s_infinite]"></span>
                <Sparkles className="w-4 h-4 text-primary" />
                The #1 Resume Builder
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-2xl mb-6"
              >
                {lang === 'en' ? (
                  <>
                    Build a Winning CV for the <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                      Tanzanian Job Market
                    </span>
                  </>
                ) : (
                  <>
                    Jenga CV Bora kwa ajili ya <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                      Soko la Ajira Tanzania
                    </span>
                  </>
                )}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mb-10"
              >
                {dict.home.heroSubtitle}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start"
              >
                <Link href={`/${lang}/builder`} className="w-full sm:w-auto bg-primary text-white px-6 py-3.5 md:px-8 md:py-4 rounded-xl text-base md:text-lg font-semibold shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-primary/30 hover:shadow-[0_0_40px_8px_rgba(59,130,246,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    {dict.home.startBuildingNow}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite] z-0"></div>
                </Link>
                <Link href={`/${lang}/interview`} className="w-full sm:w-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-6 py-3.5 md:px-8 md:py-4 rounded-xl text-base md:text-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex items-center justify-center gap-2">
                  <Mic className="w-5 h-5 text-slate-500" />
                  Practice Interview
                </Link>
              </motion.div>
            </div>

            {/* Right Content - Floating CV Animation */}
            <div className="flex-1 w-full relative min-h-[500px] flex items-center justify-center lg:justify-end perspective-[1000px] mt-8 lg:mt-0 z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
              
              <motion.div 
                className="relative w-full max-w-[400px] aspect-[1/1.4] rounded-2xl shadow-[0_20px_50px_rgba(8,112,184,0.15)] dark:shadow-[0_20px_50px_rgba(8,112,184,0.3)] overflow-visible bg-white border border-slate-200/50 dark:border-white/10"
                initial={{ opacity: 0, rotateY: -15, rotateX: 5, y: 50 }}
                animate={{ 
                  opacity: 1, 
                  rotateY: [-5, 5, -5],
                  rotateX: [2, 6, 2],
                  y: [0, -15, 0] 
                }}
                transition={{ 
                  opacity: { duration: 0.8 },
                  rotateY: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                  rotateX: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0"
                    >
                      <img 
                        src={heroImages[currentImageIndex]} 
                        alt="Professional CV Example" 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Floating elements */}
                <motion.div 
                  className="absolute -right-6 md:-right-8 top-24 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-3 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40 dark:border-white/10 flex items-center gap-3 z-20"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, delay: 1, ease: "easeInOut" }}
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-sm font-bold text-slate-800 dark:text-white pr-2">ATS Optimized</div>
                </motion.div>
                
                <motion.div 
                  className="absolute -left-6 md:-left-8 bottom-32 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-3 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40 dark:border-white/10 flex items-center gap-3 z-20"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, delay: 0.5, ease: "easeInOut" }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-sm font-bold text-slate-800 dark:text-white pr-2">Hired Faster</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
        {/* Soft transition to next section */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 pointer-events-none z-20"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-950 relative">
        {/* Extended top glow to blend from hero */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent dark:from-slate-950 pointer-events-none z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{dict.home.whyChoose}</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{dict.home.whyChooseSubtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {dict.home.features.map((feature, i) => {
              const icons = [
                <FileText key="1" className="w-10 h-10 text-primary" />,
                <Target key="2" className="w-10 h-10 text-accent" />,
                <Award key="3" className="w-10 h-10 text-gold" />
              ];
              // Make the layout bento-style
              const colSpanClass = i === 0 
                ? "md:col-span-4" 
                : i === 1 
                  ? "md:col-span-2" 
                  : "md:col-span-6";
              
              return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800/80 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 group overflow-hidden ${colSpanClass}`}
              >
                {/* Glowing hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {icons[i]}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{feature.description}</p>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative overflow-hidden py-16 bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        {/* Subtle radial mask so grid fades nicely at edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#f8fafc_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,#020617_100%)] pointer-events-none"></div>
        <div className="container relative z-20 mx-auto px-4 text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-10"
          >
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-sm" />
              ))}
            </div>
            <p className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest drop-shadow-sm">
              Trusted by 40,000+ graduates moving on to top employers
            </p>
          </motion.div>

          <div className="relative w-full max-w-5xl mx-auto overflow-hidden before:absolute before:left-0 before:top-0 before:w-16 before:h-full before:bg-gradient-to-r before:from-slate-50 before:to-transparent before:z-10 dark:before:from-slate-950 after:absolute after:right-0 after:top-0 after:w-16 after:h-full after:bg-gradient-to-l after:from-slate-50 after:to-transparent after:z-10 dark:after:from-slate-950">
            <motion.div 
              className="flex items-center gap-12 md:gap-16 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {[...Array(2)].map((_, arrayIndex) => (
                <div key={arrayIndex} className="flex gap-12 md:gap-16">
                  {[
                    { src: "/logos/crdb.png", alt: "CRDB Bank", sizeClasses: "h-16 w-40 md:h-20 md:w-48" },
                    { src: "/logos/voda.png", alt: "Vodacom", sizeClasses: "h-16 w-40 md:h-20 md:w-48" },
                    { src: "/logos/nmb.png", alt: "NMB", sizeClasses: "h-16 w-40 md:h-20 md:w-48" },
                    { src: "/logos/mix.png", alt: "Partner", sizeClasses: "h-16 w-40 md:h-20 md:w-48" }
                  ].map((logo, i) => (
                    <div 
                      key={`${arrayIndex}-${i}`}
                      className={`relative opacity-70 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 ${logo.sizeClasses}`}
                    >
                      <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
