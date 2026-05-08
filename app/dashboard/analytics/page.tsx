import { EventDistributionChart, SeverityChart, ThreatActivityChart, TopIpsChart } from "@/components/dashboard/AnalyticsChart";
import { buildActivitySeries, buildEventDistribution, buildSeveritySeries, buildTopSuspiciousIps } from "@/lib/analytics";
import { getAlerts, getLogs, getSuspiciousIps } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [logs, alerts, suspiciousIps] = await Promise.all([getLogs(), getAlerts(), getSuspiciousIps()]);
  const severities = buildSeveritySeries(alerts);
  const eventTypes = buildEventDistribution(logs);
  const activity = buildActivitySeries(logs, alerts);
  const topIps = buildTopSuspiciousIps(suspiciousIps);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Threat trends, alert severity, and event distribution.</p>
      </div>
      <section className="grid gap-6 xl:grid-cols-2">
        <ThreatActivityChart data={activity} />
        <SeverityChart data={severities} />
        <EventDistributionChart data={eventTypes} />
        <TopIpsChart data={topIps} />
      </section>
    </div>
  );
}
