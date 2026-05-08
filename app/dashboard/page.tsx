import { AlertTriangle, Database, RadioTower, ShieldAlert, XCircle } from "lucide-react";
import { AlertTable } from "@/components/dashboard/AlertTable";
import { LogsTable } from "@/components/dashboard/LogsTable";
import { StatCard } from "@/components/dashboard/StatCard";
import { ThreatActivityChart } from "@/components/dashboard/AnalyticsChart";
import { activitySeries } from "@/lib/demo-data";
import { getAlerts, getLogs, getSuspiciousIps } from "@/lib/data";

export default async function DashboardPage() {
  const [logs, alerts, suspiciousIps] = await Promise.all([getLogs(), getAlerts(), getSuspiciousIps()]);
  const failedLogins = logs.filter((log) => log.event_type === "LOGIN_FAILED").length;
  const criticalAlerts = alerts.filter((alert) => alert.severity === "critical").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Security Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real-time signal across logs, alerts, and watchlisted infrastructure.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Logs" value={logs.length} helper="Collected security events" icon={Database} />
        <StatCard label="Total Alerts" value={alerts.length} helper="Open and resolved detections" icon={ShieldAlert} tone="text-rose-300" />
        <StatCard label="Critical" value={criticalAlerts} helper="Needs immediate review" icon={AlertTriangle} tone="text-red-300" />
        <StatCard label="Suspicious IPs" value={suspiciousIps.length} helper="Tracked risk profiles" icon={RadioTower} tone="text-amber-300" />
        <StatCard label="Failed Logins" value={failedLogins} helper="Authentication failures" icon={XCircle} tone="text-orange-300" />
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ThreatActivityChart data={activitySeries} />
        <AlertTable alerts={alerts.slice(0, 4)} />
      </section>
      <LogsTable logs={logs.slice(0, 8)} />
    </div>
  );
}
