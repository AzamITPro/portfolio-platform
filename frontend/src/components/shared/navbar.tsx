"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/tracker";
import { useLanguage } from "@/context/language-context";
import { Menu, X, Sparkles, Languages } from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { lang, t, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/public/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.announcement_banner) {
          setAnnouncement(data.data.announcement_banner);
        }
      })
      .catch(() => {});
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: t.nav.about, href: "/#about" },
    { name: t.nav.skills, href: "/#skills" },
    { name: t.nav.projects, href: "/#projects" },
    { name: t.nav.services, href: "/#services" },
    { name: t.nav.journey, href: "/#journey" },
    { name: t.nav.contact, href: "/#contact" },
  ];

  return (
    <div className="sticky top-0 z-50 w-full">
      {announcement && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 text-white text-xs font-medium py-2 px-4 text-center border-b border-blue-500/30 flex items-center justify-center gap-2 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>{announcement}</span>
        </div>
      )}

      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-80"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-mono text-base font-extrabold shadow-md shadow-blue-500/20">
              A
            </span>
            <span>
              Azzam<span className="text-blue-500">.</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions & Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
              title="Switch Language / تغيير اللغة"
            >
              <Languages className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === "en" ? "عربي" : "English"}</span>
            </button>

            <a
              href="https://github.com/AzamITPro"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Profile"
              onClick={() => trackEvent("github_click", "link", "github")}
            >
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <GithubIcon className="w-3.5 h-3.5" />
                <span>{t.nav.github}</span>
              </Button>
            </a>

            <Link href="/#contact">
              <Button size="sm" className="text-xs">
                {t.nav.getInTouch}
              </Button>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg border border-zinc-800 text-xs font-semibold text-blue-400 hover:bg-zinc-900"
            >
              {lang === "en" ? "عربي" : "EN"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl px-4 py-6 space-y-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors py-1.5 px-2 rounded-md hover:bg-zinc-900"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800/80">
              <a
                href="https://github.com/AzamITPro"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("github_click", "link", "github");
                  setMobileMenuOpen(false);
                }}
              >
                <Button variant="outline" size="sm" className="w-full gap-2 text-xs justify-center">
                  <GithubIcon className="w-3.5 h-3.5" />
                  GitHub
                </Button>
              </a>
              <Link href="/#contact" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full text-xs justify-center">
                  {t.nav.getInTouch}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}