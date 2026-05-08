import { EventDistributionChart, SeverityChart, ThreatActivityChart } from "@/components/dashboard/AnalyticsChart";
import { activitySeries } from "@/lib/demo-data";
import { getAlerts, getLogs } from "@/lib/data";

export default async function AnalyticsPage() {
  const [logs, alerts] = await Promise.all([getLogs(), getAlerts()]);
  const severities = ["low", "medium", "high", "critical"].map((name) => ({
    name,
    value: alerts.filter((alert) => alert.severity === name).length
  }));
  const eventTypes = Array.from(new Set(logs.map((log) => log.event_type))).map((name) => ({
    name,
    count: logs.filter((log) => log.event_type === name).length
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Threat trends, alert severity, and event distribution.</p>
      </div>
      <section className="grid gap-6 xl:grid-cols-2">
        <ThreatActivityChart data={activitySeries} />
        <SeverityChart data={severities} />
        <EventDistributionChart data={eventTypes} />
      </section>
    </div>
  );
}
