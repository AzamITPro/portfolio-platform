import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ProjectSummary } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

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

async function getAllProjects(): Promise<ProjectSummary[]> {
  try {
    const res = await apiClient<ProjectSummary[]>("/public/projects", {
      cache: "no-store",
    });
    return res.data || [];
  } catch {
    return [];
  }
}

export default async function ProjectsArchivePage() {
  const projects = await getAllProjects();

  return (
    <main className="min-h-screen bg-zinc-950 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Top Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Overview
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Software Projects Archive
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
              Explore the full catalog of applications, systems, and developer tools engineered with clean architecture.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                    {project.project_type}
                  </Badge>
                  <span className="text-xs font-mono text-zinc-400">
                    {project.role}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white">
                  {project.title}
                </h2>

                <p className="text-sm text-zinc-400 leading-relaxed">
                  {project.short_description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.skills.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-800/60 text-zinc-300 border border-zinc-700/50"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-3">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white"
                      title="GitHub"
                    >
                      <GithubIcon className="w-5 h-5" />
                    </a>
                  )}
                  {project.live_demo_url && (
                    <a
                      href={project.live_demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white"
                      title="Demo"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>

                <Link href={`/projects/${project.slug}`}>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-blue-400">
                    Read Case Study
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}