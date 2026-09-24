"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [tagline, setTagline] = useState("Engineered with Next.js, FastAPI & PostgreSQL.");

 useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://portfolio-backend-kofh.onrender.com/api/v1";
    fetch(`${apiUrl}/public/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.site_tagline) {
          setTagline(data.data.site_tagline);
        }
      })
      .catch(() => {});
  }, []);

  // Hide public footer on all admin portal routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 text-sm py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left Info with Dynamic Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <Link
            href="/"
            className="text-base font-bold text-white tracking-tight"
          >
            Azzam<span className="text-blue-500">.</span>
          </Link>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <p className="text-xs text-zinc-400">
            © {currentYear} Azzam AL-JARMOUZI. {tagline}
          </p>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Systems Online</span>
          </div>
          <span className="text-zinc-700">•</span>
          <Link
            href="/admin/login"
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Dashboard Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}