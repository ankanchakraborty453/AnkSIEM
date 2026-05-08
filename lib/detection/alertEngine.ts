import type { SupabaseClient } from "@supabase/supabase-js";
import type { SecurityLog } from "@/types/log";
import { countRecentFailedLogins, FAILED_LOGIN_THRESHOLD, isFailedLogin } from "./failedLogin";
import { scoreLogRisk } from "./suspiciousIP";

export async function evaluateLog(supabase: SupabaseClient, log: SecurityLog) {
  if (!log.ip_address) return { alertsCreated: 0 };

  const riskScore = scoreLogRisk(log);

  await supabase.rpc("increment_suspicious_ip", {
    target_ip: log.ip_address,
    failed_delta: isFailedLogin(log) ? 1 : 0,
    risk_delta: riskScore
  });

  if (!isFailedLogin(log)) return { alertsCreated: 0 };

  const failedLoginCount = await countRecentFailedLogins(supabase, log.ip_address);
  if (failedLoginCount < FAILED_LOGIN_THRESHOLD) return { alertsCreated: 0 };

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

  return { alertsCreated: 1 };
}
