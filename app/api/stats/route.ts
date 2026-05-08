import { NextResponse } from "next/server";
import {
  buildActivitySeries,
  buildDashboardSummary,
  buildEventDistribution,
  buildSeveritySeries,
  buildTopSuspiciousIps
} from "@/lib/analytics";
import { getAlerts, getLogs, getSuspiciousIps } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const [logs, alerts, suspiciousIps] = await Promise.all([getLogs(), getAlerts(), getSuspiciousIps()]);

  return NextResponse.json({
    summary: buildDashboardSummary(logs, alerts, suspiciousIps),
    activity: buildActivitySeries(logs, alerts),
    severities: buildSeveritySeries(alerts),
    eventTypes: buildEventDistribution(logs),
    topIps: buildTopSuspiciousIps(suspiciousIps),
    recentLogs: logs.slice(0, 8),
    recentAlerts: alerts.slice(0, 8)
  });
}
