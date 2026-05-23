import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CompIntel — Premium Compensation Intelligence",
  description: "Structured compensation insights standardized by level, not title. Make informed salary decisions fast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="w-full border-t border-border-custom bg-bg-secondary/40 py-8 mt-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-accent-primary text-[10px] font-bold text-text-primary">
                𝝣
              </span>
              <span className="text-sm font-semibold tracking-tight text-text-primary">
                Comp<span className="text-accent-primary">Intel</span>
              </span>
              <span className="text-xs text-text-secondary ml-2">
                © {new Date().getFullYear()} CompIntel. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-text-secondary">
              <a href="/salaries" className="hover:text-text-primary transition-colors">Salaries</a>
              <a href="/company/google" className="hover:text-text-primary transition-colors">Companies</a>
              <a href="/compare" className="hover:text-text-primary transition-colors">Compare</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-colors">GitHub</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
