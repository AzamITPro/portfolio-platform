import { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, ArrowDown, FileText } from "lucide-react";

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
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface HeroProps {
  profile: Profile;
}

export function Hero({ profile }: HeroProps) {
  return (
    <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="max-w-3xl space-y-6 text-center sm:text-left">
          {/* Availability & Location Badges */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <Badge variant="success" className="gap-1.5 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {profile.availability}
            </Badge>
            <Badge variant="outline" className="gap-1 text-zinc-400 py-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {profile.location}
            </Badge>
          </div>

          {/* Title & Introduction */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Hi, I&apos;m{" "}
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

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-4">
            <a href="#projects">
              <Button size="lg" className="gap-2 shadow-lg shadow-blue-600/20">
                View Projects
                <ArrowDown className="w-4 h-4" />
              </Button>
            </a>
            <a href="#contact">
              <Button variant="secondary" size="lg" className="gap-2">
                <Mail className="w-4 h-4" />
                Contact Me
              </Button>
            </a>
            <a
              href="http://127.0.0.1:8000/api/v1/public/documents/cv"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2">
                <FileText className="w-4 h-4" />
                Resume / CV
              </Button>
            </a>
            {profile.social_links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.platform}
              >
                <Button variant="outline" size="lg" className="gap-2">
                  <GithubIcon className="w-4 h-4" />
                  {link.platform}
                </Button>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}