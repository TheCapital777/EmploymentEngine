"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useDictionary } from "../context/DictionaryContext";
import { LogOut, Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const { dict, lang } = useDictionary();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    if (!pathname) return;
    const newLang = lang === 'en' ? 'sw' : 'en';
    // pathname starts with /en or /sw because of middleware
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <Image src="/logo.png" alt="JengaCV Logo" width={40} height={40} className="object-contain" />
          <span className="text-xl font-bold tracking-tight text-primary">JengaCV</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href={`/${lang}/#features`} className="hover:text-primary transition-colors">{dict.header.features}</Link>
          <Link href={`/${lang}/#how-it-works`} className="hover:text-primary transition-colors">{dict.header.howItWorks}</Link>
          <Link href={`/${lang}/pricing`} className="hover:text-primary transition-colors">{dict.header.pricing}</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded"
            title="Switch Language"
          >
            <Globe className="w-4 h-4" />
            {lang === 'en' ? 'SW' : 'EN'}
          </button>
          
          {user ? (
            <>
              <Link href={`/${lang}/dashboard`} className="text-sm font-medium hover:text-primary transition-colors">
                {dict.header.dashboard}
              </Link>
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {dict.header.signOut}
              </button>
            </>
          ) : (
            <>
              <Link href={`/${lang}/login`} className="text-sm font-medium hover:text-primary transition-colors">
                {dict.header.signIn}
              </Link>
              <Link href={`/${lang}/builder`} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                {dict.header.buildMyCv}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
