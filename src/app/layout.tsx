import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { AuthProvider } from "../context/AuthContext";
import Header from "../components/Header";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CVBora AI | Tanzania's Smart Employability Platform",
  description: "AI-powered employability platform for the Tanzanian job market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <footer className="border-t border-slate-200 dark:border-slate-800 py-12 mt-auto bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4 text-center text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} CVBora AI. Tanzania's Smart Employability Platform.</p>
            </div>
          </footer>
          <Toaster position="bottom-right" toastOptions={{ className: 'font-sans' }} />
        </AuthProvider>
      </body>
    </html>
  );
}
