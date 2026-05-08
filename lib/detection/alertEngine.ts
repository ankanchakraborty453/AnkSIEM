import type { SupabaseClient } from "@supabase/supabase-js";
import type { SecurityLog } from "@/types/log";
import { countRecentFailedLogins, FAILED_LOGIN_THRESHOLD, isFailedLogin } from "./failedLogin";
import { scoreLogRisk } from "./suspiciousIP";

type DetectionResult = {
  alertsCreated: number;
  riskScore: number;
  rulesMatched: string[];
};

function directAlertForLog(log: SecurityLog, riskScore: number) {
  if (log.event_type === "PORT_SCAN") {
    return {
      alert_type: "PORT_SCAN",
      severity: log.severity === "critical" ? "critical" : "high",
      title: "Port scan detected",
      description: `Sequential probing activity was detected from ${log.ip_address}.`,
      riskScore
    };
  }

  if (log.event_type === "MALWARE_DETECTED") {
    return {
      alert_type: "MALWARE_DETECTED",
      severity: "critical",
      title: "Malware detection reported",
      description: log.message ?? "Endpoint telemetry reported a malware detection.",
      riskScore
    };
  }

  if (log.event_type === "UNUSUAL_LOCATION") {
    return {
      alert_type: "UNUSUAL_LOCATION",
      severity: log.severity === "high" || log.severity === "critical" ? log.severity : "medium",
      title: "Unusual login location",
      description: log.message ?? `Unusual login context observed for ${log.username ?? "unknown user"}.`,
      riskScore
    };
  }

  if (log.severity === "critical") {
    return {
      alert_type: "CRITICAL_EVENT",
      severity: "critical",
      title: "Critical security event",
      description: log.message ?? "A critical severity event was ingested.",
      riskScore
    };
  }

  return null;
}

export async function evaluateLog(supabase: SupabaseClient, log: SecurityLog) {
  const rulesMatched: string[] = [];
  if (!log.ip_address) return { alertsCreated: 0, riskScore: 0, rulesMatched } satisfies DetectionResult;

  const riskScore = scoreLogRisk(log);

  await supabase.rpc("increment_suspicious_ip", {
    target_ip: log.ip_address,
    failed_delta: isFailedLogin(log) ? 1 : 0,
    risk_delta: riskScore
  });

  const directAlert = directAlertForLog(log, riskScore);
  if (directAlert) {
    const { error } = await supabase.from("alerts").insert({
      log_id: log.id,
      alert_type: directAlert.alert_type,
      severity: directAlert.severity,
      title: directAlert.title,
      description: directAlert.description,
      ip_address: log.ip_address,
      username: log.username,
      status: "open"
    });

    if (error) throw error;
    rulesMatched.push(directAlert.alert_type);
    return { alertsCreated: 1, riskScore, rulesMatched } satisfies DetectionResult;
  }

  if (!isFailedLogin(log)) return { alertsCreated: 0, riskScore, rulesMatched } satisfies DetectionResult;

  const failedLoginCount = await countRecentFailedLogins(supabase, log.ip_address);
  rulesMatched.push("FAILED_LOGIN_OBSERVED");
  if (failedLoginCount < FAILED_LOGIN_THRESHOLD) {
    return { alertsCreated: 0, riskScore, rulesMatched } satisfies DetectionResult;
  }

  const { error } = await supabase.from("alerts").insert({
    log_id: log.id,
    alert_type: "BRUTE_FORCE_ATTEMPT",
    severity: "high",
    title: "Brute force attempt detected",
    description: `${failedLoginCount} failed login attempts from ${log.ip_address} in the last 10 minutes.`,
    ip_address: log.ip_address,
    username: log.username,
    status: "open"
  });

  if (error) throw error;
  rulesMatched.push("BRUTE_FORCE_ATTEMPT");

  return { alertsCreated: 1, riskScore, rulesMatched } satisfies DetectionResult;
}
