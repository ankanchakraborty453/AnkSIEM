import { Bell, Search } from "lucide-react";
import { MobileNav, Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/85 px-5 backdrop-blur">
          <div className="flex w-full max-w-md items-center gap-2 rounded-md border border-border bg-black/20 px-3 py-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <span>Search logs, IPs, alerts</span>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="h-5 w-5 text-cyan-200" />
            <div className="hidden text-right text-sm sm:block">
              <div className="font-medium">security.ops</div>
              <div className="text-xs text-muted-foreground">Analyst</div>
            </div>
          </div>
        </header>
        <MobileNav />
        <div className="p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
