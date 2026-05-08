import type { SecurityAlert, SuspiciousIP } from "@/types/alert";
import type { SecurityLog } from "@/types/log";

export const demoLogs: SecurityLog[] = [
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    source: "auth-service",
    event_type: "LOGIN_FAILED",
    username: "admin",
    ip_address: "203.0.113.42",
    status: "failed",
    message: "Invalid password for privileged account",
    severity: "high",
    created_at: new Date().toISOString()
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    source: "edge-firewall",
    event_type: "PORT_SCAN",
    username: null,
    ip_address: "198.51.100.18",
    status: "blocked",
    message: "Sequential port probe detected across SSH, RDP, and Postgres",
    severity: "critical",
    created_at: new Date().toISOString()
  },
  {
    id: "log-3",
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    source: "endpoint-agent",
    event_type: "MALWARE_DETECTED",
    username: "ankit",
    ip_address: "10.10.4.21",
    status: "quarantined",
    message: "Suspicious binary isolated from downloads directory",
    severity: "critical",
    created_at: new Date().toISOString()
  },
  {
    id: "log-4",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    source: "vpn",
    event_type: "UNUSUAL_LOCATION",
    username: "security.ops",
    ip_address: "192.0.2.77",
    status: "review",
    message: "New country login for analyst account",
    severity: "medium",
    created_at: new Date().toISOString()
  }
];

export const demoAlerts: SecurityAlert[] = [
  {
    id: "alert-1",
    log_id: "log-1",
    alert_type: "BRUTE_FORCE_ATTEMPT",
    severity: "high",
    title: "Brute force attempt detected",
    description: "Five failed logins from 203.0.113.42 inside a 10 minute window.",
    ip_address: "203.0.113.42",
    username: "admin",
    status: "open",
    created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  },
  {
    id: "alert-2",
    log_id: "log-2",
    alert_type: "PORT_SCAN",
    severity: "critical",
    title: "External reconnaissance blocked",
    description: "Firewall blocked a high-rate scan pattern against exposed services.",
    ip_address: "198.51.100.18",
    username: null,
    status: "open",
    created_at: new Date(Date.now() - 11 * 60 * 1000).toISOString()
  }
];

export const demoSuspiciousIps: SuspiciousIP[] = [
  {
    id: "ip-1",
    ip_address: "198.51.100.18",
    failed_attempts: 2,
    risk_score: 92,
    last_seen: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    country: "Unknown",
    status: "watchlisted"
  },
  {
    id: "ip-2",
    ip_address: "203.0.113.42",
    failed_attempts: 5,
    risk_score: 78,
    last_seen: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    country: "Unknown",
    status: "watchlisted"
  }
];

export const activitySeries = [
  { time: "09:00", failures: 3, alerts: 1 },
  { time: "10:00", failures: 7, alerts: 2 },
  { time: "11:00", failures: 5, alerts: 1 },
  { time: "12:00", failures: 13, alerts: 4 },
  { time: "13:00", failures: 9, alerts: 2 },
  { time: "14:00", failures: 18, alerts: 5 }
];
