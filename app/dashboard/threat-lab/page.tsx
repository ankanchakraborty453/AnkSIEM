"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  AlertOctagon,
  CheckCircle2,
  FlaskConical,
  Globe,
  Play,
  RefreshCcw,
  ShieldAlert,
  Terminal,
  UserX
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { NewSecurityLog } from "@/types/log";

type AttackScenario = {
  id: string;
  title: string;
  description: string;
  expected: string;
  icon: typeof UserX;
  color: string;
  bg: string;
  payload: Omit<NewSecurityLog, "timestamp">;
  count: number;
};

type LabResult = {
  id: string;
  success: boolean;
  title: string;
  message: string;
  time: string;
  details?: string;
};

const ATTACKS: AttackScenario[] = [
  {
    id: "brute_force",
    title: "Brute Force Simulation",
    description: "Sends 5 failed login attempts for admin from one IP.",
    expected: "Creates a high severity brute-force alert.",
    icon: UserX,
    color: "text-orange-300",
    bg: "bg-orange-400/10",
    payload: {
      source: "auth-service",
      event_type: "LOGIN_FAILED",
      username: "admin",
      ip_address: "192.168.1.50",
      status: "failed",
      message: "Invalid credentials attempt against privileged account",
      severity: "medium"
    },
    count: 5
  },
  {
    id: "port_scan",
    title: "External Port Scan",
    description: "Simulates a sequential port probe from an untrusted source.",
    expected: "Creates a high severity port-scan alert and raises IP risk.",
    icon: ShieldAlert,
    color: "text-red-300",
    bg: "bg-red-400/10",
    payload: {
      source: "edge-firewall",
      event_type: "PORT_SCAN",
      username: null,
      ip_address: "185.220.101.42",
      status: "blocked",
      message: "Scanning activity detected on ports 22, 80, 443, 3389",
      severity: "high"
    },
    count: 1
  },
  {
    id: "malware",
    title: "Malware Detection",
    description: "Reports suspicious binary execution on an endpoint.",
    expected: "Creates a critical malware alert.",
    icon: AlertOctagon,
    color: "text-fuchsia-300",
    bg: "bg-fuchsia-400/10",
    payload: {
      source: "endpoint-agent",
      event_type: "MALWARE_DETECTED",
      username: "ankit",
      ip_address: "10.10.4.12",
      status: "quarantined",
      message: "Heuristic match for Trojan:Win32/SpyEye",
      severity: "critical"
    },
    count: 1
  },
  {
    id: "anomalous",
    title: "Anomalous Login",
    description: "Records a successful login from a previously unseen location.",
    expected: "Creates a medium severity unusual-location alert.",
    icon: Globe,
    color: "text-cyan-300",
    bg: "bg-cyan-400/10",
    payload: {
      source: "auth-service",
      event_type: "UNUSUAL_LOCATION",
      username: "security.ops",
      ip_address: "45.33.22.11",
      status: "success",
      message: "New country login detected: Brazil",
      severity: "medium"
    },
    count: 1
  }
];

const DEFAULT_CUSTOM_EVENT = JSON.stringify(
  {
    source: "custom-sensor",
    event_type: "PORT_SCAN",
    username: null,
    ip_address: "203.0.113.91",
    status: "blocked",
    message: "Custom lab event from hosted threat simulator",
    severity: "high"
  },
  null,
  2
);

export default function ThreatLabPage() {
  const [running, setRunning] = useState<string | null>(null);
  const [results, setResults] = useState<LabResult[]>([]);
  const [customEvent, setCustomEvent] = useState(DEFAULT_CUSTOM_EVENT);
  const [stats, setStats] = useState<{ openAlerts: number; totalLogs: number; highRiskIps: number } | null>(null);

  const lastStatus = useMemo(() => results[0], [results]);

  async function refreshStats() {
    const response = await fetch("/api/stats", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as {
      summary: { openAlerts: number; totalLogs: number; highRiskIps: number };
    };
    setStats(data.summary);
  }

  async function ingest(payload: Omit<NewSecurityLog, "timestamp">) {
    const response = await fetch("/api/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, timestamp: new Date().toISOString() })
    });
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.error ?? "Ingestion failed");
    }
    return body as { detection?: { alertsCreated: number; riskScore: number; rulesMatched: string[] } };
  }

  async function runScenario(attack: AttackScenario) {
    setRunning(attack.id);
    try {
      let alertsCreated = 0;
      let riskScore = 0;
      const matchedRules = new Set<string>();

      for (let i = 0; i < attack.count; i += 1) {
        const response = await ingest(attack.payload);
        alertsCreated += response.detection?.alertsCreated ?? 0;
        riskScore = Math.max(riskScore, response.detection?.riskScore ?? 0);
        response.detection?.rulesMatched?.forEach((rule) => matchedRules.add(rule));
        if (attack.count > 1) await new Promise((resolve) => setTimeout(resolve, 300));
      }

      await refreshStats();
      addResult({
        id: attack.id,
        success: true,
        title: attack.title,
        message: `${attack.count} event${attack.count > 1 ? "s" : ""} ingested, ${alertsCreated} alert${alertsCreated === 1 ? "" : "s"} created.`,
        details: `Risk score ${riskScore}. Rules: ${Array.from(matchedRules).join(", ") || "none"}.`,
        time: new Date().toLocaleTimeString()
      });
    } catch (error) {
      addResult({
        id: attack.id,
        success: false,
        title: attack.title,
        message: error instanceof Error ? error.message : "Simulation failed",
        time: new Date().toLocaleTimeString()
      });
    } finally {
      setRunning(null);
    }
  }

  async function runCustomEvent() {
    setRunning("custom");
    try {
      const payload = JSON.parse(customEvent) as Omit<NewSecurityLog, "timestamp">;
      const response = await ingest(payload);
      await refreshStats();
      addResult({
        id: "custom",
        success: true,
        title: "Custom Event",
        message: `Custom event ingested, ${response.detection?.alertsCreated ?? 0} alert(s) created.`,
        details: `Rules: ${response.detection?.rulesMatched?.join(", ") || "none"}.`,
        time: new Date().toLocaleTimeString()
      });
    } catch (error) {
      addResult({
        id: "custom",
        success: false,
        title: "Custom Event",
        message: error instanceof Error ? error.message : "Invalid JSON or ingestion failure",
        time: new Date().toLocaleTimeString()
      });
    } finally {
      setRunning(null);
    }
  }

  function addResult(result: LabResult) {
    setResults((current) => [result, ...current].slice(0, 12));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Threat Lab</h1>
          <p className="mt-1 text-sm text-muted-foreground">Generate safe synthetic security events against the live SIEM pipeline.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={refreshStats} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-slate-200 hover:bg-white/5">
            <RefreshCcw className="h-4 w-4" />
            Refresh Metrics
          </button>
          <Link href="/dashboard/alerts" className="inline-flex items-center gap-2 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/15">
            <ShieldAlert className="h-4 w-4" />
            Review Alerts
          </Link>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Lab Status</p>
          <p className="mt-3 text-2xl font-semibold text-white">{running ? "Running" : "Ready"}</p>
          <p className="mt-2 text-sm text-muted-foreground">{lastStatus?.message ?? "Choose a scenario to begin."}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Open Alerts</p>
          <p className="mt-3 text-2xl font-semibold text-white">{stats?.openAlerts ?? "-"}</p>
          <p className="mt-2 text-sm text-muted-foreground">Refresh after a simulation to confirm alerting.</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">High-Risk IPs</p>
          <p className="mt-3 text-2xl font-semibold text-white">{stats?.highRiskIps ?? "-"}</p>
          <p className="mt-2 text-sm text-muted-foreground">{stats ? `${stats.totalLogs} total logs indexed.` : "Connected through /api/stats."}</p>
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Activity className="h-4 w-4" />
            Attack Scenarios
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {ATTACKS.map((attack) => (
              <Card key={attack.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className={cn("rounded-lg p-2.5", attack.bg)}>
                    <attack.icon className={cn("h-6 w-6", attack.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-white">{attack.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{attack.description}</p>
                    <p className="mt-3 text-xs text-cyan-100">{attack.expected}</p>
                  </div>
                </div>
                <button
                  onClick={() => runScenario(attack)}
                  disabled={Boolean(running)}
                  className={cn(
                    "mt-4 flex w-full items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition",
                    running === attack.id ? "cursor-not-allowed bg-slate-800 text-slate-400" : "bg-white/5 text-white hover:bg-cyan-400 hover:text-slate-950"
                  )}
                >
                  {running === attack.id ? <Activity className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  {running === attack.id ? "Simulating..." : "Execute"}
                </button>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Custom Event Injector</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                value={customEvent}
                onChange={(event) => setCustomEvent(event.target.value)}
                spellCheck={false}
                className="min-h-64 w-full rounded-md border border-border bg-black/40 p-3 font-mono text-xs text-slate-100 outline-none focus:border-cyan-400"
              />
              <button
                onClick={runCustomEvent}
                disabled={Boolean(running)}
                className="inline-flex items-center gap-2 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FlaskConical className="h-4 w-4" />
                Ingest Custom Event
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Terminal className="h-4 w-4" />
            Execution Console
          </h2>
          <Card>
            <CardContent className="min-h-[520px] p-4 font-mono text-xs">
              {results.length === 0 ? (
                <div className="flex min-h-[480px] items-center justify-center text-muted-foreground">
                  Waiting for simulation execution...
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <div key={`${result.id}-${index}`} className="rounded-md border border-border bg-black/30 p-3">
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground">[{result.time}]</span>
                        {result.success ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                        ) : (
                          <AlertCircle className="h-4 w-4 shrink-0 text-red-300" />
                        )}
                        <div>
                          <div className={result.success ? "text-emerald-200" : "text-red-200"}>{result.title}: {result.message}</div>
                          {result.details ? <div className="mt-1 text-muted-foreground">{result.details}</div> : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
