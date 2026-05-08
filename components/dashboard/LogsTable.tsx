import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { SecurityLog } from "@/types/log";

export function LogsTable({ logs }: { logs: SecurityLog[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Events</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border/70">
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(log.timestamp)}</td>
                  <td className="px-4 py-3 font-medium text-slate-100">{log.event_type}</td>
                  <td className="px-4 py-3">{log.username ?? "system"}</td>
                  <td className="px-4 py-3 font-mono text-cyan-200">{log.ip_address ?? "-"}</td>
                  <td className="px-4 py-3"><Badge tone={log.severity}>{log.severity}</Badge></td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">{log.message ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile card list */}
        <div className="divide-y divide-border md:hidden">
          {logs.map((log) => (
            <div key={log.id} className="space-y-2 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-slate-100">{log.event_type}</span>
                <Badge tone={log.severity}>{log.severity}</Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>{log.username ?? "system"}</span>
                {log.ip_address && <span className="font-mono text-cyan-200">{log.ip_address}</span>}
              </div>
              {log.message && <p className="truncate text-xs text-muted-foreground">{log.message}</p>}
              <p className="text-xs text-muted-foreground/60">{formatDate(log.timestamp)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
