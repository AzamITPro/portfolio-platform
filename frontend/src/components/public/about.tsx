import { Profile } from "@/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { Layers, ShieldCheck, Database, Layout } from "lucide-react";

interface AboutProps {
  profile: Profile;
}

export function About({ profile }: AboutProps) {
  const highlights = [
    {
      icon: Layers,
      title: "Clean Architecture",
      desc: "Modular design separating business logic, repositories, and API controllers.",
    },
    {
      icon: ShieldCheck,
      title: "Security by Design",
      desc: "HttpOnly cookies, bcrypt hashing, rate limiting, and parameter sanitization.",
    },
    {
      icon: Database,
      title: "Robust Data Layer",
      desc: "Relational modeling in PostgreSQL with Alembic migrations and zero data leakage.",
    },
    {
      icon: Layout,
      title: "Modern UI Engineering",
      desc: "High-performance interfaces built with Next.js App Router, TypeScript & Tailwind.",
    },
  ];

  return (
    <section id="about" className="py-20 border-t border-zinc-900 bg-zinc-950/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="About Me"
          title="Engineering Philosophy & Focus"
          description="A look into my background, technical focus, and how I approach building software systems."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Narrative / About Me text */}
          <div className="lg:col-span-6 space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl">
              {profile.about_me}
            </p>
            <p className="text-zinc-400 text-sm">
              As an IT student and aspiring engineer, I believe projects should not just look good on the surface, but represent clean, scalable software engineering beneath the interface.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2.5 transition-colors hover:border-zinc-700"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}