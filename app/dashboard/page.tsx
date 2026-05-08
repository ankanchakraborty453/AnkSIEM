import { AlertTriangle, Database, RadioTower, ShieldAlert, XCircle } from "lucide-react";
import { AlertTable } from "@/components/dashboard/AlertTable";
import { LogsTable } from "@/components/dashboard/LogsTable";
import { StatCard } from "@/components/dashboard/StatCard";
import { ThreatActivityChart } from "@/components/dashboard/AnalyticsChart";
import { buildActivitySeries, buildDashboardSummary } from "@/lib/analytics";
import { getAlerts, getLogs, getSuspiciousIps } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [logs, alerts, suspiciousIps] = await Promise.all([getLogs(), getAlerts(), getSuspiciousIps()]);
  const summary = buildDashboardSummary(logs, alerts, suspiciousIps);
  const activity = buildActivitySeries(logs, alerts);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Security Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real-time signal across logs, alerts, and watchlisted infrastructure.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Logs" value={summary.totalLogs} helper="Collected security events" icon={Database} />
        <StatCard label="Open Alerts" value={summary.openAlerts} helper={`${summary.totalAlerts} total detections`} icon={ShieldAlert} tone="text-rose-300" />
        <StatCard label="Critical" value={summary.criticalAlerts} helper="Needs immediate review" icon={AlertTriangle} tone="text-red-300" />
        <StatCard label="High-Risk IPs" value={summary.highRiskIps} helper={`${summary.suspiciousIps} tracked sources`} icon={RadioTower} tone="text-amber-300" />
        <StatCard label="Failed Logins" value={summary.failedLogins} helper="Authentication failures" icon={XCircle} tone="text-orange-300" />
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ThreatActivityChart data={activity} />
        <AlertTable alerts={alerts.slice(0, 4)} />
      </section>
      <LogsTable logs={logs.slice(0, 8)} />
    </div>
  );
}
