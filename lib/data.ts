import { demoAlerts, demoLogs, demoSuspiciousIps } from "@/lib/demo-data";
import { createServiceClient } from "@/lib/supabase/server";
import type { SecurityAlert, SuspiciousIP } from "@/types/alert";
import type { SecurityLog } from "@/types/log";

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function getLogs(): Promise<SecurityLog[]> {
  if (!hasSupabaseEnv()) return demoLogs;
  const { data, error } = await createServiceClient()
    .from("logs")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(100);
  if (error) return demoLogs;
  return data as SecurityLog[];
}

export async function getAlerts(): Promise<SecurityAlert[]> {
  if (!hasSupabaseEnv()) return demoAlerts;
  const { data, error } = await createServiceClient()
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return demoAlerts;
  return data as SecurityAlert[];
}

export async function getSuspiciousIps(): Promise<SuspiciousIP[]> {
  if (!hasSupabaseEnv()) return demoSuspiciousIps;
  const { data, error } = await createServiceClient()
    .from("suspicious_ips")
    .select("*")
    .order("risk_score", { ascending: false })
    .limit(100);
  if (error) return demoSuspiciousIps;
  return data as SuspiciousIP[];
}
