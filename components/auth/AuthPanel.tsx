"use client";

import Link from "next/link";
import { useState } from "react";
import { Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AuthPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/dashboard";
  }

  async function signUp() {
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` }
    });
    setLoading(false);
    setMessage(error ? error.message : "Account created. Check email confirmation settings in Supabase if sign-in is blocked.");
  }

  async function simulateFailure() {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "auth-service",
        event_type: "LOGIN_FAILED",
        username: email || "guest_user",
        ip_address: "1.1.1.1",
        status: "failed",
        severity: "low",
        message: "Manual test from login page"
      })
    });
    setLoading(false);
    setMessage(response.ok ? "Simulated failed login recorded." : "Failed to record simulated login.");
  }

  return (
    <form className="w-full max-w-sm rounded-lg border border-border bg-card/80 p-6 shadow-xl shadow-black/20" onSubmit={(event) => event.preventDefault()}>
      <div className="mb-6 flex items-center gap-3">
        <Shield className="h-6 w-6 text-cyan-300" />
        <div>
          <h1 className="font-semibold text-white">AnkSIEM Login</h1>
          <p className="text-sm text-muted-foreground">Supabase Auth</p>
        </div>
      </div>

      <label className="text-sm text-muted-foreground" htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="mt-2 w-full rounded-md border border-border bg-black/30 px-3 py-2 outline-none focus:border-cyan-400"
      />
      <label className="mt-4 block text-sm text-muted-foreground" htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="mt-2 w-full rounded-md border border-border bg-black/30 px-3 py-2 outline-none focus:border-cyan-400"
      />

      <div className="mt-6 grid gap-3">
        <button
          type="button"
          disabled={loading || !email || !password}
          onClick={signIn}
          className="rounded-md bg-cyan-400 px-4 py-2 font-medium text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sign in
        </button>
        <button
          type="button"
          disabled={loading || !email || !password}
          onClick={signUp}
          className="rounded-md border border-border px-4 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create account
        </button>
      </div>

      {message ? <p className="mt-4 rounded-md border border-border bg-black/20 p-3 text-sm text-muted-foreground">{message}</p> : null}

      <div className="mt-8 border-t border-border pt-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Simulation Mode</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={simulateFailure}
            className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Simulate Failure
          </button>
          <Link
            href="/dashboard"
            className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-xs font-medium text-emerald-300 hover:bg-emerald-500/20"
          >
            Demo Access
          </Link>
        </div>
      </div>
    </form>
  );
}
