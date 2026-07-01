"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useDictionary } from "../context/DictionaryContext";
import { LogOut, Globe, LayoutDashboard, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { user, logout } = useAuth();
  const { dict, lang } = useDictionary();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLanguage = () => {
    if (!pathname) return;
    const newLang = lang === "en" ? "sw" : "en";
    router.push(pathname.replace(`/${lang}`, `/${newLang}`));
  };

  const navLinks = [
    { href: `/${lang}/#features`, label: dict.header.features, isRoute: false },
    { href: `/${lang}/#how-it-works`, label: dict.header.howItWorks, isRoute: false },
    { href: `/${lang}/pricing`, label: dict.header.pricing, isRoute: true },
    { href: `/${lang}/interview`, label: "Interview Prep", isRoute: true },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.3)] border-b border-slate-200/60 dark:border-white/[0.06]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        {/* Ambient glow — bleeds through the translucent scrolled header */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 pointer-events-none -z-10"
              style={{ background: "radial-gradient(60% 120% at 50% 0%, rgba(59,130,246,0.10), transparent)" }}
            />
          )}
        </AnimatePresence>

        <div className="container mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src="/logo.png"
                alt="JengaCV Logo"
                width={36}
                height={36}
                className="relative rounded-xl object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden min-[360px]:block">
              Jenga<span className="text-primary">CV</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = link.isRoute && pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg group ${
                    isActive
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.06]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-primary/10 dark:bg-primary/15 rounded-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                  {!isActive && (
                    <span className="absolute bottom-1 left-4 right-4 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              title="Switch Language"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.10] px-3 py-1.5 rounded-lg transition-all duration-200"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "en" ? "SW" : "EN"}
            </button>

            {user ? (
              <>
                <Link
                  href={`/${lang}/dashboard`}
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {dict.header.dashboard}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{dict.header.signOut}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/${lang}/login`}
                  className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all duration-200"
                >
                  {dict.header.signIn}
                </Link>
                <Link
                  href={`/${lang}/builder`}
                  className="group relative overflow-hidden flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-lg)] hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                >
                  <span className="relative z-10">{dict.header.buildMyCv}</span>
                  <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-slate-700 dark:bg-slate-300 rounded-full transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block w-5 h-0.5 bg-slate-700 dark:bg-slate-300 rounded-full transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-slate-700 dark:bg-slate-300 rounded-full transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          } bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/60 dark:border-white/[0.06]`}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary px-3 py-2.5 rounded-lg hover:bg-primary/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="h-px bg-slate-200/60 dark:bg-white/[0.06] my-2" />

            {user ? (
              <>
                <Link
                  href={`/${lang}/dashboard`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary px-3 py-2.5 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {dict.header.dashboard}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-sm font-medium text-slate-500 hover:text-red-500 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {dict.header.signOut}
                </button>
              </>
            ) : (
              <Link
                href={`/${lang}/login`}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary px-3 py-2.5 rounded-lg hover:bg-primary/5 transition-colors"
              >
                {dict.header.signIn}
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
