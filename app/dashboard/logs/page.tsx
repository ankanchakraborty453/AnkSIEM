import { LogExplorer } from "@/components/dashboard/LogExplorer";
import { getLogs } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const logs = await getLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Search, filter, and export collected events.</p>
        </div>
      </div>
      <LogExplorer logs={logs} />
    </div>
  );
}
