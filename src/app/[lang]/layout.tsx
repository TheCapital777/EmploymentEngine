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
  params: Promise<{ lang: 'en' | 'sw' }>;
}>) {
  const { lang } = await params;
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
            <footer className="py-6 mt-auto bg-slate-50 dark:bg-slate-950">
              <div className="container mx-auto px-4 text-center text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} JengaCV. Tanzania's Smart Employability Platform.</p>
              </div>
            </footer>
            <Toaster position="bottom-right" toastOptions={{ className: 'font-sans' }} />
          </DictionaryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
