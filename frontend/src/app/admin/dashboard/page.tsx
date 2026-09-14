import Link from "next/link";
import { cookies } from "next/headers";
import { apiClient } from "@/lib/api-client";
import { ProjectSummary, SkillCategory, ServiceItem } from "@/types";
import {
  FolderGit2,
  Cpu,
  Wrench,
  Users,
  Eye,
  FileDown,
  BarChart3,
  TrendingUp,
  Database,
  ExternalLink,
  CheckCircle2,
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

interface AnalyticsSummary {
  total_page_views: number;
  unique_visitors: number;
  cv_downloads: number;
  github_clicks: number;
  contact_submissions: number;
  top_pages: { path: string; count: number }[];
  daily_traffic: { date: string; views: number }[];
}

async function getDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  try {
    const [projectsRes, skillsRes, servicesRes, analyticsRes] = await Promise.all([
      apiClient<ProjectSummary[]>("/public/projects", { cache: "no-store" }),
      apiClient<SkillCategory[]>("/public/skills", { cache: "no-store" }),
      apiClient<ServiceItem[]>("/public/services", { cache: "no-store" }),
      apiClient<AnalyticsSummary>("/admin/analytics/summary", {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).catch((err) => {
        console.error("Analytics fetch error:", err);
        return {
          data: {
            total_page_views: 0,
            unique_visitors: 0,
            cv_downloads: 0,
            github_clicks: 0,
            contact_submissions: 0,
            top_pages: [],
            daily_traffic: [],
          },
        };
      }),
    ]);

    const totalSkills = (skillsRes.data || []).reduce(
      (acc, cat) => acc + (cat.skills?.length || 0),
      0
    );

    return {
      projectsCount: projectsRes.data?.length || 0,
      skillsCount: totalSkills,
      servicesCount: servicesRes.data?.length || 0,
      analytics: analyticsRes.data,
    };
  } catch (err) {
    console.error("Dashboard loading error:", err);
    return {
      projectsCount: 0,
      skillsCount: 0,
      servicesCount: 0,
      analytics: {
        total_page_views: 0,
        unique_visitors: 0,
        cv_downloads: 0,
        github_clicks: 0,
        contact_submissions: 0,
        top_pages: [],
        daily_traffic: [],
      },
    };
  }
}

export default async function AdminDashboardPage() {
  const { projectsCount, skillsCount, servicesCount, analytics } =
    await getDashboardData();

  const maxDailyViews = Math.max(
    ...analytics.daily_traffic.map((d) => d.views),
    1
  );

  return (
    <div className="max-w-6xl space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-900/30 via-zinc-900/60 to-zinc-900/40 border border-zinc-800/80">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Analytics & Control Hub 👋
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Real-time traffic telemetry and content metrics synced with PostgreSQL.
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
            <span>FastAPI Docs</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>

      {/* Traffic Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Page Views</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {analytics.total_page_views}
          </div>
          <p className="text-[11px] text-zinc-400">Direct page hits logged</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Unique Visitors</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {analytics.unique_visitors}
          </div>
          <p className="text-[11px] text-zinc-400">Anonymized session IDs</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">CV Downloads</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {analytics.cv_downloads}
          </div>
          <p className="text-[11px] text-zinc-400">Resume interaction events</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">GitHub Clicks</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <GithubIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {analytics.github_clicks}
          </div>
          <p className="text-[11px] text-zinc-400">Outbound profile visits</p>
        </div>
      </div>

      {/* Traffic Chart & Most Visited Pages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Daily Traffic Chart */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Daily Traffic Timeline</span>
              </h2>
              <p className="text-xs text-zinc-400 pt-0.5">Visitor trends over time</p>
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-800/60 px-2.5 py-1 rounded-lg">
              Last 7 Days
            </span>
          </div>

          {/* SVG/CSS Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-zinc-800 pb-2">
            {analytics.daily_traffic.map((day) => {
              const heightPercent = Math.max((day.views / maxDailyViews) * 100, 8);
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.views}
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-gradient-to-t from-blue-600 to-sky-400 rounded-t-lg transition-all duration-300 group-hover:from-blue-500 group-hover:to-sky-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] font-mono text-zinc-400 truncate w-full text-center">
                    {day.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Visited Pages List */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Top Pages Visited</span>
          </h2>

          <div className="space-y-3">
            {analytics.top_pages.length === 0 ? (
              <p className="text-xs text-zinc-400">No page views recorded yet.</p>
            ) : (
              analytics.top_pages.map((p, idx) => (
                <div
                  key={p.path}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs"
                >
                  <span className="font-mono text-zinc-300 truncate max-w-[140px]">
                    {p.path}
                  </span>
                  <span className="font-mono text-blue-400 font-semibold">
                    {p.count} views
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}