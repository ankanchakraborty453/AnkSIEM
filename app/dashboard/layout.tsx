import { Bell, Search, Shield } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";
import { RealtimeRefresh } from "@/components/dashboard/RealtimeRefresh";
import { MobileNav, Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <RealtimeRefresh />
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/85 px-3 backdrop-blur sm:h-16 sm:px-5">
          <div className="hidden items-center gap-2 rounded-md border border-border bg-black/20 px-3 py-2 text-sm text-muted-foreground sm:flex sm:w-full sm:max-w-md">
            <Search className="h-4 w-4" />
            <span>Search logs, IPs, alerts</span>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <Shield className="h-5 w-5 text-cyan-300" />
            <span className="text-sm font-semibold">AnkSIEM</span>
          </div>
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-cyan-200" />
            <UserMenu />
          </div>
        </header>
        <MobileNav />
        <div className="p-3 sm:p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
