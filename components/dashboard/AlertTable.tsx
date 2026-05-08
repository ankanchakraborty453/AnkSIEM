import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResolveAlertButton } from "@/components/dashboard/ResolveAlertButton";
import { formatDate } from "@/lib/utils";
import type { SecurityAlert } from "@/types/alert";

export function AlertTable({ alerts }: { alerts: SecurityAlert[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Timeline</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">IP</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-b border-border/70">
                <td className="px-4 py-3 text-muted-foreground">{formatDate(alert.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-100">{alert.title}</div>
                  <div className="text-xs text-muted-foreground">{alert.description}</div>
                </td>
                <td className="px-4 py-3"><Badge tone={alert.severity}>{alert.severity}</Badge></td>
                <td className="px-4 py-3 font-mono text-cyan-200">{alert.ip_address ?? "-"}</td>
                <td className="px-4 py-3"><Badge tone={alert.status}>{alert.status}</Badge></td>
                <td className="px-4 py-3">
                  <ResolveAlertButton id={alert.id} disabled={alert.status === "resolved"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
