"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="CVBora Logo" width={40} height={40} className="object-contain" />
          <span className="text-xl font-bold tracking-tight text-primary">CVBora AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="/#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
          <Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link href="/builder" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                Build My CV
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
