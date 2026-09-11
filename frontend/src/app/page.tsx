import { apiClient } from "@/lib/api-client";
import { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Sparkles, CheckCircle2 } from "lucide-react";

// Clean standalone GitHub SVG Icon
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

async function getProfileData(): Promise<Profile | null> {
  try {
    const res = await apiClient<Profile>("/public/profile", {
      cache: "no-store",
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch profile:", err);
    return null;
  }
}

export default async function HomePage() {
  const profile = await getProfileData();

  if (!profile) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center font-bold">!</div>
          <h1 className="text-xl font-semibold">Backend Connection Pending</h1>
          <p className="text-sm text-zinc-400">
            Make sure FastAPI is running on <code className="text-blue-400">http://127.0.0.1:8000</code>.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 antialiased selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl w-full space-y-8 text-center sm:text-left bg-zinc-900/60 border border-zinc-800/80 p-8 sm:p-10 rounded-2xl backdrop-blur-xl shadow-2xl">
        {/* Availability Badge */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <Badge variant="success" className="gap-1.5 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {profile.availability}
          </Badge>
          <Badge variant="outline" className="gap-1 text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            {profile.location}
          </Badge>
        </div>

        {/* Hero Details */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {profile.full_name}
          </h1>
          <p className="text-lg sm:text-xl font-medium text-blue-400">
            {profile.professional_title}
          </p>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed pt-2">
            {profile.short_bio}
          </p>
        </div>

        {/* Live Architecture Verification Card */}
        <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 text-xs text-zinc-400 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Full-Stack Decoupled Architecture Connected</span>
          </div>
          <p>
            Data retrieved live from <strong>FastAPI Backend</strong> & <strong>PostgreSQL</strong> database.
          </p>
        </div>

        {/* Actions & Social Links */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
          <Button size="lg" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Explore Portfolio
          </Button>
          {profile.social_links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2">
                <GithubIcon className="w-4 h-4" />
                {link.platform}
              </Button>
            </a>
          ))}
          <a href={`mailto:${profile.email}`}>
            <Button variant="ghost" size="lg" className="gap-2">
              <Mail className="w-4 h-4" />
              Contact
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
}