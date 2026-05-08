import type { SecurityLog } from "@/types/log";

export function scoreLogRisk(log: Pick<SecurityLog, "event_type" | "severity" | "status">) {
  let score = 0;

  if (log.event_type === "LOGIN_FAILED") score += 10;
  if (log.event_type === "PORT_SCAN") score += 30;
  if (log.event_type === "MALWARE_DETECTED") score += 40;
  if (log.event_type === "UNUSUAL_LOCATION") score += 20;
  if (log.severity === "critical") score += 30;
  if (log.severity === "high") score += 20;
  if (log.status === "blocked") score += 15;

  return Math.min(score, 100);
}

export function riskLevel(score: number) {
  if (score >= 81) return "critical";
  if (score >= 61) return "high";
  if (score >= 31) return "medium";
  return "low";
}
