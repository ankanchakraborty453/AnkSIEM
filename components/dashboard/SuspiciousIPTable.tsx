import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { riskLevel } from "@/lib/detection/suspiciousIP";
import type { SuspiciousIP } from "@/types/alert";

export function SuspiciousIPTable({ ips }: { ips: SuspiciousIP[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suspicious IP Watchlist</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">IP Address</th>
              <th className="px-4 py-3">Failed Attempts</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Last Seen</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {ips.map((ip) => (
              <tr key={ip.id} className="border-b border-border/70">
                <td className="px-4 py-3 font-mono text-cyan-200">{ip.ip_address}</td>
                <td className="px-4 py-3">{ip.failed_attempts}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 rounded bg-slate-800">
                      <div className="h-2 rounded bg-cyan-300" style={{ width: `${ip.risk_score}%` }} />
                    </div>
                    <Badge tone={riskLevel(ip.risk_score)}>{ip.risk_score}</Badge>
                  </div>
                </td>
                <td className="px-4 py-3">{ip.country ?? "-"}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(ip.last_seen)}</td>
                <td className="px-4 py-3">{ip.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
