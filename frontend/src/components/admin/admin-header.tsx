import Link from "next/link";
import { ExternalLink, Shield } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          API Connected
        </span>
      </div>

      {/* User Info & Public Site Link */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="h-4 w-px bg-zinc-800" />

        <div className="flex items-center gap-2 text-xs">
          <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-white">Azzam AL-JARMOUZI</span>
            <span className="text-[10px] text-zinc-400">Super Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}