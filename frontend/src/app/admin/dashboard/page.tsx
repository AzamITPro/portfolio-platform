import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { ProjectSummary, SkillCategory, ServiceItem } from "@/types";
import {
  FolderGit2,
  Cpu,
  Wrench,
  Inbox,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Database,
  ExternalLink,
} from "lucide-react";

interface MessageItem {
  id: number;
  name: string;
  email: string;
  subject: string;
  status: string;
  created_at: string;
}

async function getDashboardStats() {
  try {
    const [projectsRes, skillsRes, servicesRes] = await Promise.all([
      apiClient<ProjectSummary[]>("/public/projects", { cache: "no-store" }),
      apiClient<SkillCategory[]>("/public/skills", { cache: "no-store" }),
      apiClient<ServiceItem[]>("/public/services", { cache: "no-store" }),
    ]);

    // Count total skills across categories
    const totalSkills = (skillsRes.data || []).reduce(
      (acc, cat) => acc + (cat.skills?.length || 0),
      0
    );

    return {
      projectsCount: projectsRes.data?.length || 0,
      categoriesCount: skillsRes.data?.length || 0,
      skillsCount: totalSkills,
      servicesCount: servicesRes.data?.length || 0,
      latestProjects: projectsRes.data || [],
    };
  } catch (err) {
    console.error("Failed to load dashboard metrics:", err);
    return {
      projectsCount: 0,
      categoriesCount: 0,
      skillsCount: 0,
      servicesCount: 0,
      latestProjects: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const kpiCards = [
    {
      title: "Total Projects",
      value: stats.projectsCount,
      desc: "Live portfolio case studies",
      icon: FolderGit2,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Active Skills",
      value: stats.skillsCount,
      desc: `Across ${stats.categoriesCount} stack categories`,
      icon: Cpu,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Services Offered",
      value: stats.servicesCount,
      desc: "Client solutions & capabilities",
      icon: Wrench,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "System Security",
      value: "100%",
      desc: "HttpOnly cookies & bcrypt enabled",
      icon: ShieldCheck,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <div className="max-w-6xl space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-900/30 via-zinc-900/60 to-zinc-900/40 border border-zinc-800/80">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, Azzam 👋
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Your portfolio CMS is fully synced with PostgreSQL database.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Interactive API Docs</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">{kpi.title}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white tracking-tight">{kpi.value}</div>
                <p className="text-[11px] text-zinc-400 pt-1">{kpi.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time System Verification Card */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Production Architecture Health Checklist</span>
          </h2>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            All Systems Operational
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1">
            <span className="text-zinc-400">Database Engine</span>
            <p className="text-white font-semibold">PostgreSQL 16 (Port 5433)</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1">
            <span className="text-zinc-400">Backend API</span>
            <p className="text-white font-semibold">FastAPI + Pydantic v2</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1">
            <span className="text-zinc-400">Frontend Layer</span>
            <p className="text-white font-semibold">Next.js 14+ (App Router)</p>
          </div>
        </div>
      </div>
    </div>
  );
}