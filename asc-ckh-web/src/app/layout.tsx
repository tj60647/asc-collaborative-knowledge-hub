import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Mountain } from "lucide-react";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASC Collaborative Knowledge Hub",
  description: "The digital ecosystem for the American Society for Cybernetics. Fostering collaborative research, cybernetic education, and systemic knowledge curation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        
        {/* Constant Footer with consistent width */}
        <footer className="w-full border-t bg-background">
          <div className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Mountain className="h-5 w-5 text-zinc-900 dark:text-zinc-50" />
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">ASC CKH</span>
            </div>
            
            <nav aria-label="Footer navigation" className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/about" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                About
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
