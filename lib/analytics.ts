import type { SecurityAlert, SuspiciousIP } from "@/types/alert";
import type { SecurityLog } from "@/types/log";

const HOUR_MS = 60 * 60 * 1000;

export function buildActivitySeries(logs: SecurityLog[], alerts: SecurityAlert[]) {
  const now = new Date();
  const buckets = Array.from({ length: 8 }, (_, index) => {
    const start = new Date(now.getTime() - (7 - index) * HOUR_MS);
    return {
      start,
      label: start.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }),
      failures: 0,
      alerts: 0
    };
  });

  for (const log of logs) {
    const timestamp = new Date(log.timestamp).getTime();
    const bucket = buckets.find((item, index) => {
      const next = buckets[index + 1]?.start.getTime() ?? now.getTime() + HOUR_MS;
      return timestamp >= item.start.getTime() && timestamp < next;
    });
    if (bucket && (log.event_type === "LOGIN_FAILED" || log.status === "failed")) {
      bucket.failures += 1;
    }
  }

  for (const alert of alerts) {
    const timestamp = new Date(alert.created_at).getTime();
    const bucket = buckets.find((item, index) => {
      const next = buckets[index + 1]?.start.getTime() ?? now.getTime() + HOUR_MS;
      return timestamp >= item.start.getTime() && timestamp < next;
    });
    if (bucket) bucket.alerts += 1;
  }

  return buckets.map(({ label, failures, alerts: alertCount }) => ({
    time: label,
    failures,
    alerts: alertCount
  }));
}

export function buildSeveritySeries(alerts: SecurityAlert[]) {
  return ["low", "medium", "high", "critical"].map((name) => ({
    name,
    value: alerts.filter((alert) => alert.severity === name).length
  }));
}

export function buildEventDistribution(logs: SecurityLog[]) {
  return Array.from(new Set(logs.map((log) => log.event_type))).map((name) => ({
    name,
    count: logs.filter((log) => log.event_type === name).length
  }));
}

export function buildTopSuspiciousIps(ips: SuspiciousIP[]) {
  return ips.slice(0, 8).map((ip) => ({
    name: ip.ip_address,
    score: ip.risk_score,
    failedAttempts: ip.failed_attempts
  }));
}

export function buildDashboardSummary(logs: SecurityLog[], alerts: SecurityAlert[], ips: SuspiciousIP[]) {
  const openAlerts = alerts.filter((alert) => alert.status === "open");
  const criticalAlerts = alerts.filter((alert) => alert.severity === "critical" && alert.status === "open");
  const failedLogins = logs.filter((log) => log.event_type === "LOGIN_FAILED" || log.status === "failed");
  const highRiskIps = ips.filter((ip) => ip.risk_score >= 61);

  return {
    totalLogs: logs.length,
    totalAlerts: alerts.length,
    openAlerts: openAlerts.length,
    criticalAlerts: criticalAlerts.length,
    suspiciousIps: ips.length,
    highRiskIps: highRiskIps.length,
    failedLogins: failedLogins.length
  };
}
