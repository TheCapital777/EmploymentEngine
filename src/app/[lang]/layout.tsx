import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import Image from "next/image";
import { AuthProvider } from "../../context/AuthContext";
import Header from "../../components/Header";
import { Toaster } from 'react-hot-toast';
import { getDictionary } from "../../lib/dictionaries";
import { DictionaryProvider } from "../../context/DictionaryContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CVBora AI | Tanzania's Smart Employability Platform",
  description: "AI-powered employability platform for the Tanzanian job market.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'sw';
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className="scroll-smooth">
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <AuthProvider>
          <DictionaryProvider dict={dict} lang={lang}>
            <Header />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <footer className="mt-auto bg-slate-950 border-t border-white/[0.06]">
              <div className="container mx-auto px-4 sm:px-6 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                  {/* Brand */}
                  <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-2.5 mb-4">
                      <img src="/logo.png" alt="JengaCV" className="w-9 h-9 rounded-xl object-contain" />
                      <span className="text-xl font-bold text-white">Jenga<span className="text-primary">CV</span></span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                      Tanzania's #1 AI-powered employability platform. Build ATS-optimized CVs in minutes.
                    </p>
                  </div>
                  {/* Product */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Product</p>
                    <ul className="space-y-3">
                      {[{label:"CV Builder", href:`/${lang}/builder`},{label:"Interview Simulator", href:`/${lang}/interview`},{label:"Pricing", href:`/${lang}/pricing`}].map(l => (
                        <li key={l.href}>
                          <a href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">{l.label}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Company */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Company</p>
                    <ul className="space-y-3">
                      {[{label:"About"},{label:"Blog"},{label:"Careers"}].map(l => (
                        <li key={l.label}>
                          <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">{l.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Legal */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Legal</p>
                    <ul className="space-y-3">
                      {[{label:"Privacy Policy"},{label:"Terms of Service"},{label:"Refund Policy"}].map(l => (
                        <li key={l.label}>
                          <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">{l.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} JengaCV · Tanzania's Smart Employability Platform
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    All systems operational
                  </div>
                </div>
              </div>
            </footer>
            <Toaster position="bottom-right" toastOptions={{ className: 'font-sans' }} />
          </DictionaryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
