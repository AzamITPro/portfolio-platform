import Link from "next/link";
import { ProjectSummary } from "@/types";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight, FolderGit2 } from "lucide-react";

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

interface ProjectsSectionProps {
  projects: ProjectSummary[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-20 border-t border-zinc-900 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <SectionHeading
            badge="Featured Work"
            title="Highlighted Software Projects"
            description="Real-world engineering applications engineered from concept to production."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:shadow-2xl hover:shadow-blue-500/5"
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                    {project.project_type}
                  </Badge>
                  <span className="text-xs font-mono text-zinc-400">
                    {project.role}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {project.short_description}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-800/60 text-zinc-300 border border-zinc-700/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
                <div className="flex items-center gap-3">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white transition-colors"
                      title="GitHub Repository"
                    >
                      <GithubIcon className="w-5 h-5" />
                    </a>
                  )}
                  {project.live_demo_url && (
                    <a
                      href={project.live_demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>

                <Link href={`/projects/${project.slug}`}>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-blue-400 hover:text-blue-300">
                    Case Study
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}