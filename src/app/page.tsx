"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Target, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container relative mx-auto px-4 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Premium ATS-Friendly CV Builder
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mb-6"
          >
            Built for Tanzanian Graduates. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Designed with HR Intelligence.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10"
          >
            Bridge the gap between your potential and employer expectations. Create professional, localized, and ATS-optimized CVs that get you hired.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
          >
            <button className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group">
              Start Building Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl text-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              View Templates
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Choose CVBora AI?</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Our platform combines cutting-edge Gemini AI with deep local recruitment knowledge to give you the competitive edge.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="w-10 h-10 text-primary" />,
                title: "ATS Optimization",
                description: "Ensure your CV passes through automated Applicant Tracking Systems used by top Tanzanian employers."
              },
              {
                icon: <Target className="w-10 h-10 text-accent" />,
                title: "Industry Specific",
                description: "Tailored phrasing and keywords for Banking, Telecoms, NGOs, and Government sectors."
              },
              {
                icon: <Award className="w-10 h-10 text-gold" />,
                title: "HR-Approved Standards",
                description: "Formats and structures verified by leading human resource professionals in East Africa."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-primary/20 transition-all group"
              >
                <div className="bg-white dark:bg-slate-800 w-16 h-16 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-y border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">Trusted by graduates moving on to</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            <div className="text-2xl font-bold font-serif">CRDB Bank</div>
            <div className="text-2xl font-bold italic">Vodacom</div>
            <div className="text-2xl font-black">NMB</div>
            <div className="text-2xl font-bold">TIGO</div>
          </div>
        </div>
      </section>
    </div>
  );
}
