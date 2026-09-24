"use client";

import { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackEvent } from "@/lib/tracker";
import { useLanguage } from "@/context/language-context";
import { MapPin, Mail, ArrowDown, FileText, Globe } from "lucide-react";

function PlatformIcon({ platform, className = "w-4 h-4" }: { platform: string; className?: string }) {
  const p = platform.toLowerCase();

  if (p.includes("github")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    );
  }

  if (p.includes("linkedin")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }

  if (p.includes("whatsapp")) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    );
  }

  return <Globe className={className} />;
}

interface HeroProps {
  profile: Profile;
}

export function Hero({ profile }: HeroProps) {
  const { lang, t } = useLanguage();

  const availabilityText =
    lang === "ar" && profile.availability.toLowerCase().includes("available")
      ? t.hero.available
      : profile.availability;

  return (
    <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6 text-center sm:text-start">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <Badge variant="success" className="gap-1.5 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {availabilityText}
              </Badge>
              <Badge variant="outline" className="gap-1 text-zinc-400 py-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                {profile.location}
              </Badge>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {lang === "ar" ? "مرحباً، أنا " : "Hi, I'm "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
                  {profile.full_name}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-zinc-300">
                {profile.professional_title}
              </p>
              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl pt-2">
                {profile.short_bio}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-4">
              <a href="#projects">
                <Button size="lg" className="gap-2 shadow-lg shadow-blue-600/20">
                  {t.hero.viewProjects}
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </a>
              <a href="#contact">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Mail className="w-4 h-4" />
                  {t.hero.contactMe}
                </Button>
              </a>
             <a
              href={`${process.env.NEXT_PUBLIC_API_URL || "https://portfolio-backend-kofh.onrender.com/api/v1"}/public/documents/cv/download`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cv_download", "document", "cv")}
            >
              <Button variant="outline" size="lg" className="gap-2">
                <FileText className="w-4 h-4" />
                {t.hero.downloadCv}
              </Button>
            </a>
              {profile.social_links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.platform}
                  onClick={() => {
                    trackEvent(`${link.platform.toLowerCase()}_click`, "link", link.platform);
                  }}
                >
                  <Button variant="outline" size="lg" className="gap-2">
                    <PlatformIcon platform={link.platform} className="w-4 h-4" />
                    {link.platform}
                  </Button>
                </a>
              ))}
            </div>
          </div>

          {/* Profile Avatar Showcase */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30 blur-xl group-hover:opacity-50 transition duration-500" />
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-zinc-800 bg-zinc-900 shadow-2xl">
                {profile.profile_image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={profile.profile_image_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 bg-zinc-950">
                    <span className="text-4xl font-extrabold text-blue-500">A</span>
                    <span className="text-xs text-zinc-500 pt-2 font-mono">Azzam</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}