"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResolveAlertButton } from "@/components/dashboard/ResolveAlertButton";
import { formatDate } from "@/lib/utils";
import type { SecurityAlert } from "@/types/alert";

export function AlertConsole({ alerts }: { alerts: SecurityAlert[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("open");

  const filteredAlerts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return alerts.filter((alert) => {
      const matchesStatus = status === "all" || alert.status === status;
      const haystack = [alert.title, alert.description, alert.alert_type, alert.username, alert.ip_address, alert.severity]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [alerts, query, status]);

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Alert Console</CardTitle>
          <div className="flex rounded-md border border-border bg-black/20 p-1 text-sm">
            {["open", "resolved", "all"].map((item) => (
              <button
                key={item}
                onClick={() => setStatus(item)}
                className={`rounded px-3 py-1.5 capitalize ${status === item ? "bg-cyan-400/15 text-cyan-100" : "text-muted-foreground hover:text-white"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 rounded-md border border-border bg-black/20 px-3 py-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, type, IP, user"
            className="w-full bg-transparent text-slate-100 outline-none placeholder:text-muted-foreground"
          />
        </label>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Alert</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">IP</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alert) => (
              <tr key={alert.id} className="border-b border-border/70">
                <td className="px-4 py-3 text-muted-foreground">{formatDate(alert.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-100">{alert.title}</div>
                  <div className="text-xs text-muted-foreground">{alert.description}</div>
                </td>
                <td className="px-4 py-3"><Badge tone={alert.severity}>{alert.severity}</Badge></td>
                <td className="px-4 py-3 font-mono text-cyan-200">{alert.ip_address ?? "-"}</td>
                <td className="px-4 py-3"><Badge tone={alert.status}>{alert.status}</Badge></td>
                <td className="px-4 py-3"><ResolveAlertButton id={alert.id} disabled={alert.status === "resolved"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No alerts match the current view.</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
