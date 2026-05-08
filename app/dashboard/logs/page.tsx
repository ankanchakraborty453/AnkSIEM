import { Download, Filter } from "lucide-react";
import { LogsTable } from "@/components/dashboard/LogsTable";
import { getLogs } from "@/lib/data";

export default async function LogsPage() {
  const logs = await getLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Search, filter, and export collected events.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-slate-200 hover:bg-white/5">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <a href="/api/logs/export" className="inline-flex items-center gap-2 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/15">
            <Download className="h-4 w-4" /> Export CSV
          </a>
        </div>
      </div>
      <LogsTable logs={logs} />
    </div>
  );
}
