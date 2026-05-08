export type LogSeverity = "low" | "medium" | "high" | "critical";

export type EventType =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "PORT_SCAN"
  | "MALWARE_DETECTED"
  | "UNUSUAL_LOCATION"
  | "BRUTE_FORCE_ATTEMPT";

export type SecurityLog = {
  id: string;
  timestamp: string;
  source: string;
  event_type: EventType | string;
  username: string | null;
  ip_address: string | null;
  status: string | null;
  message: string | null;
  severity: LogSeverity;
  created_at: string;
};

export type NewSecurityLog = Omit<SecurityLog, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};
