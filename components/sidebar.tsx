"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, BarChart3, LayoutDashboard, ListFilter, RadioTower, Settings, Shield, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/logs", label: "Logs", icon: ListFilter },
  { href: "/dashboard/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/dashboard/suspicious-ips", label: "Suspicious IPs", icon: RadioTower },
  { href: "/dashboard/threat-lab", label: "Threat Lab", icon: ShieldAlert },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-black/20 p-4 lg:block">
      <div className="mb-7 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10">
          <Shield className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <div className="font-semibold tracking-wide">AnkSIEM</div>
          <div className="text-xs text-muted-foreground">Mini SIEM Console</div>
        </div>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white",
                active && "bg-cyan-400/10 text-cyan-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
