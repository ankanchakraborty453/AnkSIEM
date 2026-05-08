import type { LogSeverity } from "@/types/log";

export type AlertStatus = "open" | "resolved";

export type SecurityAlert = {
  id: string;
  log_id: string | null;
  alert_type: string;
  severity: LogSeverity;
  title: string;
  description: string | null;
  ip_address: string | null;
  username: string | null;
  status: AlertStatus;
  created_at: string;
};

export type SuspiciousIP = {
  id: string;
  ip_address: string;
  failed_attempts: number;
  risk_score: number;
  last_seen: string;
  country: string | null;
  status: "watchlisted" | "blocked" | "cleared" | string;
};
