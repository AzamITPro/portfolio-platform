"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/lib/auth-helpers";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  Wrench,
  GraduationCap,
  Award,
  Image as ImageIcon,
  Inbox,
  Settings,
  LogOut,
} from "lucide-react";

const navigationItems = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Profile & Social", href: "/admin/profile", icon: User },
  { name: "Projects CMS", href: "/admin/projects", icon: FolderGit2 },
  { name: "Skills Arsenal", href: "/admin/skills", icon: Cpu },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Journey & Career", href: "/admin/journey", icon: GraduationCap },
  { name: "Certificates", href: "/admin/certificates", icon: Award },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  { name: "Messages Inbox", href: "/admin/messages", icon: Inbox },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950 flex flex-col justify-between h-screen sticky top-0">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-zinc-800/80">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-mono text-sm font-bold shadow-md shadow-blue-500/20">
            A
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-tight">Azzam Admin</span>
            <span className="text-[10px] text-zinc-400 font-mono">Control Center</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Bottom */}
      <div className="p-4 border-t border-zinc-800/80">
        <button
          onClick={() => logoutAdmin()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}