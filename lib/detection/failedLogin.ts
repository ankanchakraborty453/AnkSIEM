import type { SupabaseClient } from "@supabase/supabase-js";
import type { SecurityLog } from "@/types/log";

const WINDOW_MINUTES = 10;
const FAILED_LOGIN_THRESHOLD = 5;

export async function countRecentFailedLogins(
  supabase: SupabaseClient,
  ipAddress: string,
  now = new Date()
) {
  const windowStart = new Date(now.getTime() - WINDOW_MINUTES * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("logs")
    .select("id", { count: "exact", head: true })
    .eq("ip_address", ipAddress)
    .eq("event_type", "LOGIN_FAILED")
    .gte("timestamp", windowStart);

  if (error) throw error;
  return count ?? 0;
}

export function isFailedLogin(log: Pick<SecurityLog, "event_type" | "status">) {
  return log.event_type === "LOGIN_FAILED" || log.status === "failed";
}

export { FAILED_LOGIN_THRESHOLD, WINDOW_MINUTES };
