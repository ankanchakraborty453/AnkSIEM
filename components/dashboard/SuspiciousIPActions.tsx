"use client";

import { Ban, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SuspiciousIPActions({ ipAddress, status }: { ipAddress: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function setStatus(nextStatus: "blocked" | "cleared") {
    setLoading(nextStatus);
    await fetch(`/api/suspicious-ips/${encodeURIComponent(ipAddress)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={loading !== null || status === "blocked"}
        onClick={() => setStatus("blocked")}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-slate-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        title="Block IP"
        aria-label="Block IP"
      >
        <Ban className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={loading !== null || status === "cleared"}
        onClick={() => setStatus("cleared")}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-slate-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        title="Clear IP"
        aria-label="Clear IP"
      >
        <CheckCircle2 className="h-4 w-4" />
      </button>
    </div>
  );
}
