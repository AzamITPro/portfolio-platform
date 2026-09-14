"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/tracker";
import { Menu, X } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide public navbar on all admin portal routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Skills", href: "/#skills" },
    { name: "Projects", href: "/#projects" },
    { name: "Services", href: "/#services" },
    { name: "Journey", href: "/#journey" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-80 focus-visible:outline-blue-500"
          aria-label="Azzam AL-JARMOUZI Homepage"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-mono text-base font-extrabold shadow-md shadow-blue-500/20">
            A
          </span>
          <span>
            Azzam<span className="text-blue-500">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="transition-colors hover:text-white focus-visible:outline-blue-500"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/AzamITPro"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile"
            onClick={() => trackEvent("github_click", "link", "github")}
            aria-label="Open GitHub Profile"
          >
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </Button>
          </a>
          <Link href="/#contact">
            <Button size="sm" className="text-xs">
              Get in Touch
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors focus-visible:outline-blue-500"
            aria-label="Toggle Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
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
                GitHub Profile
              </Button>
            </a>
            <Link href="/#contact" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full text-xs justify-center">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}