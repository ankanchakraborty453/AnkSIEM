"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function RealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleRefresh = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => router.refresh(), 350);
    };

    const channel = supabase
      .channel("anksiem-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "logs" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "suspicious_ips" }, scheduleRefresh)
      .subscribe();

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
