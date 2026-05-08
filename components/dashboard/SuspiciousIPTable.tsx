import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { riskLevel } from "@/lib/detection/suspiciousIP";
import { SuspiciousIPActions } from "@/components/dashboard/SuspiciousIPActions";
import type { SuspiciousIP } from "@/types/alert";

export function SuspiciousIPTable({ ips }: { ips: SuspiciousIP[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suspicious IP Watchlist</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Failed Attempts</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Last Seen</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
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
                  <td className="px-4 py-3"><SuspiciousIPActions ipAddress={ip.ip_address} status={ip.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile card list */}
        <div className="divide-y divide-border md:hidden">
          {ips.map((ip) => (
            <div key={ip.id} className="space-y-3 px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-cyan-200">{ip.ip_address}</span>
                <Badge tone={ip.status as any}>{ip.status}</Badge>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Risk Score</span>
                  <Badge tone={riskLevel(ip.risk_score)}>{ip.risk_score}</Badge>
                </div>
                <div className="h-1.5 w-full rounded bg-slate-800">
                  <div className="h-1.5 rounded bg-cyan-300" style={{ width: `${ip.risk_score}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Failed Attempts: {ip.failed_attempts}</span>
                <span>{ip.country ?? "Unknown Location"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground/60">{formatDate(ip.last_seen)}</span>
                <SuspiciousIPActions ipAddress={ip.ip_address} status={ip.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
