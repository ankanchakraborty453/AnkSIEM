"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ResolveAlertButton({ id, disabled }: { id: string; disabled: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function resolveAlert() {
    setLoading(true);
    await fetch(`/api/alerts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "resolved" })
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={resolveAlert}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-slate-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
      title="Resolve alert"
      aria-label="Resolve alert"
    >
      <CheckCircle2 className="h-4 w-4" />
    </button>
  );
}
