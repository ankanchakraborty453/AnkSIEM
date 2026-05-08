"use client";

import { Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form className="w-full max-w-sm rounded-lg border border-border bg-card/80 p-6 shadow-xl shadow-black/20">
        <div className="mb-6 flex items-center gap-3">
          <Shield className="h-6 w-6 text-cyan-300" />
          <div>
            <h1 className="font-semibold text-white">AnkSIEM Login</h1>
            <p className="text-sm text-muted-foreground">Supabase Auth hook point</p>
          </div>
        </div>
        <label className="text-sm text-muted-foreground" htmlFor="email">Email</label>
        <input id="email" type="email" className="mt-2 w-full rounded-md border border-border bg-black/30 px-3 py-2 outline-none focus:border-cyan-400" />
        <label className="mt-4 block text-sm text-muted-foreground" htmlFor="password">Password</label>
        <input id="password" type="password" className="mt-2 w-full rounded-md border border-border bg-black/30 px-3 py-2 outline-none focus:border-cyan-400" />
        <button className="mt-6 w-full rounded-md bg-cyan-400 px-4 py-2 font-medium text-slate-950 hover:bg-cyan-300">
          Sign in
        </button>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Simulation Mode</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={async () => {
                await fetch("/api/ingest", {
                  method: "POST",
                  body: JSON.stringify({
                    source: "auth-service",
                    event_type: "LOGIN_FAILED",
                    username: "guest_user",
                    ip_address: "1.1.1.1",
                    status: "failed",
                    severity: "low",
                    message: "Manual test from login page"
                  })
                });
                alert("Simulated failed login recorded!");
              }}
              className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20"
            >
              Simulate Failure
            </button>
            <button 
              type="button"
              onClick={() => window.location.href = "/dashboard"}
              className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20"
            >
              Demo Access
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
