import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { apiClient } from "@/lib/api-client";
import { ProjectDetail } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectGallery } from "@/components/public/project-gallery";
import {
  ArrowLeft,
  ExternalLink,
  Target,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
} from "lucide-react";

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

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProjectData(slug: string): Promise<ProjectDetail | null> {
  try {
    const res = await apiClient<ProjectDetail>(`/public/projects/${slug}`, {
      cache: "no-store",
    });
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectData(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project case study could not be found.",
    };
  }

  return {
    title: `${project.title} | Case Study`,
    description: project.short_description,
    keywords: [project.title, project.project_type, ...project.skills],
    openGraph: {
      title: `${project.title} - Architectural Case Study`,
      description: project.short_description,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectData(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 py-16 sm:py-24 text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Navigation & Status */}
        <div className="flex items-center justify-between">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Projects
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="success">{project.status}</Badge>
            <Badge variant="outline">{project.project_type}</Badge>
          </div>
        </div>

        {/* Project Header */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            {project.title}
          </h1>
          <p className="text-lg sm:text-xl text-blue-400 font-medium">
            Role: {project.role}
          </p>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed pt-2">
            {project.short_description}
          </p>
        </div>

        {/* Showcase Banner: Video Demo or Cover Image */}
        {project.cover_image_url && (
          <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
            {project.cover_image_url.endsWith(".mp4") || project.cover_image_url.endsWith(".webm") ? (
              <video
                controls
                playsInline
                preload="metadata"
                className="w-full aspect-video object-cover"
              >
                <source src={project.cover_image_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={project.cover_image_url}
                alt={project.title}
                className="w-full max-h-[460px] object-cover"
              />
            )}
          </div>
        )}

        {/* Links & Source Code Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-y border-zinc-800/80 py-4">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <GithubIcon className="w-4 h-4" />
                View Source Code
              </Button>
            </a>
          )}
          {project.live_demo_url && (
            <a
              href={project.live_demo_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="gap-2 text-xs">
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </Button>
            </a>
          )}
        </div>

        {/* Technologies Applied */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Technologies & Architecture
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs font-mono px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700/70 text-zinc-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Screenshots Gallery (Lightbox with Next/Prev) */}
        {project.media_items && project.media_items.length > 0 && (
          <ProjectGallery mediaItems={project.media_items} />
        )}

        {/* Deep-Dive Case Study Cards */}
        <div className="space-y-8 pt-4">
          {project.problem && (
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                <Target className="w-4 h-4" />
                <span>The Problem Statement</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.problem}
              </p>
            </div>
          )}

          {project.solution && (
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                <Lightbulb className="w-4 h-4" />
                <span>Engineered Solution</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.solution}
              </p>
            </div>
          )}

          {project.features && (
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Core Engineering Features</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.features}
              </p>
            </div>
          )}

          {project.challenges && (
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Technical Challenges & Overcoming Them</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.challenges}
              </p>
            </div>
          )}

          {project.learnings && (
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>Key Engineering Takeaways</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.learnings}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}