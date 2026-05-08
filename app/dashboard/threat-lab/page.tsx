"use client";

import { useState } from "react";
import { 
  AlertOctagon, 
  ShieldAlert, 
  UserX, 
  Globe, 
  Terminal, 
  Activity,
  Play,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const ATTACKS = [
  {
    id: "brute_force",
    title: "Brute Force Simulation",
    description: "Sends 5 failed login attempts for 'admin' to trigger a security alert.",
    icon: UserX,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    payload: {
      source: "auth-service",
      event_type: "LOGIN_FAILED",
      username: "admin",
      ip_address: "192.168.1.50",
      status: "failed",
      message: "Invalid credentials attempt",
      severity: "medium"
    },
    count: 5
  },
  {
    id: "port_scan",
    title: "External Port Scan",
    description: "Simulates a sequential port probe from an untrusted external IP.",
    icon: ShieldAlert,
    color: "text-red-400",
    bg: "bg-red-400/10",
    payload: {
      source: "edge-firewall",
      event_type: "PORT_SCAN",
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
    description: "Reports a suspicious binary execution on an internal endpoint.",
    icon: AlertOctagon,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
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
    description: "Successful login from a previously unseen geographical location.",
    icon: Globe,
    color: "text-cyan-400",
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

export default function ThreatLabPage() {
  const [running, setRunning] = useState<string | null>(null);
  const [results, setResults] = useState<{id: string, success: boolean, msg: string}[]>([]);

  const runSimulation = async (attack: typeof ATTACKS[0]) => {
    setRunning(attack.id);
    const newResults = [...results];
    
    try {
      for (let i = 0; i < attack.count; i++) {
        const response = await fetch("/api/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(attack.payload)
        });
        
        if (!response.ok) throw new Error("Ingestion failed");
        
        // Add a small delay for brute force simulation to feel real
        if (attack.count > 1) await new Promise(r => setTimeout(r, 500));
      }
      
      newResults.unshift({ id: attack.id, success: true, msg: `Successfully triggered ${attack.title}` });
    } catch (err) {
      newResults.unshift({ id: attack.id, success: false, msg: `Failed to trigger ${attack.title}` });
    } finally {
      setResults(newResults.slice(0, 10)); // Keep last 10
      setRunning(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Threat Lab</h1>
        <p className="text-muted-foreground">Simulate security incidents to test your dashboard and alerting logic.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Activity className="h-4 w-4" />
            Attack Scenarios
          </h2>
          <div className="grid gap-4">
            {ATTACKS.map((attack) => (
              <div 
                key={attack.id} 
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card/40 p-5 transition-all hover:border-cyan-500/50 hover:bg-card/60"
              >
                <div className="flex items-start gap-4">
                  <div className={cn("rounded-lg p-2.5", attack.bg)}>
                    <attack.icon className={cn("h-6 w-6", attack.color)} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{attack.title}</h3>
                    <p className="text-sm text-muted-foreground">{attack.description}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => runSimulation(attack)}
                  disabled={!!running}
                  className={cn(
                    "mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all",
                    running === attack.id 
                      ? "bg-slate-800 text-slate-400 cursor-not-allowed" 
                      : "bg-white/5 text-white hover:bg-cyan-500 hover:text-black"
                  )}
                >
                  {running === attack.id ? (
                    <Activity className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {running === attack.id ? "Simulating..." : "Execute Simulation"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Terminal className="h-4 w-4" />
            Simulation Logs
          </h2>
          <div className="min-h-[400px] rounded-xl border border-border bg-black/40 p-4 font-mono text-xs">
            {results.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground italic">
                Waiting for simulation execution...
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((res, i) => (
                  <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-muted-foreground">[{new Date().toLocaleTimeString()}]</span>
                    {res.success ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                    )}
                    <span className={res.success ? "text-emerald-300" : "text-red-300"}>
                      {res.msg}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
