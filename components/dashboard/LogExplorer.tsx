"use client";

import { Download, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { SecurityLog } from "@/types/log";

const severities = ["all", "low", "medium", "high", "critical"];

export function LogExplorer({ logs }: { logs: SecurityLog[] }) {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("all");
  const [eventType, setEventType] = useState("all");

  const eventTypes = useMemo(() => ["all", ...Array.from(new Set(logs.map((log) => log.event_type)))], [logs]);

  const filteredLogs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesSeverity = severity === "all" || log.severity === severity;
      const matchesEvent = eventType === "all" || log.event_type === eventType;
      const haystack = [log.source, log.event_type, log.username, log.ip_address, log.status, log.message]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesSeverity && matchesEvent && (!normalized || haystack.includes(normalized));
    });
  }, [eventType, logs, query, severity]);

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Log Explorer</CardTitle>
          <a
            href="/api/logs/export"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-400/15"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_180px_240px]">
          <label className="flex items-center gap-2 rounded-md border border-border bg-black/20 px-3 py-2 text-sm text-muted-foreground sm:col-span-2 lg:col-span-1">
            <Search className="h-4 w-4 shrink-0" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search source, user, IP, message"
              className="w-full bg-transparent text-slate-100 outline-none placeholder:text-muted-foreground"
            />
          </label>
          <label className="flex items-center gap-2 rounded-md border border-border bg-black/20 px-3 py-2 text-sm">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
            <select value={severity} onChange={(event) => setSeverity(event.target.value)} className="w-full bg-transparent text-slate-100 outline-none">
              {severities.map((item) => (
                <option key={item} value={item} className="bg-slate-950">
                  {item === "all" ? "All severities" : item}
                </option>
              ))}
            </select>
          </label>
          <select value={eventType} onChange={(event) => setEventType(event.target.value)} className="rounded-md border border-border bg-black/20 px-3 py-2 text-sm text-slate-100 outline-none">
            {eventTypes.map((item) => (
              <option key={item} value={item} className="bg-slate-950">
                {item === "all" ? "All event types" : item}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-border/70">
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(log.timestamp)}</td>
                  <td className="px-4 py-3">{log.source}</td>
                  <td className="px-4 py-3 font-medium text-slate-100">{log.event_type}</td>
                  <td className="px-4 py-3">{log.username ?? "system"}</td>
                  <td className="px-4 py-3 font-mono text-cyan-200">{log.ip_address ?? "-"}</td>
                  <td className="px-4 py-3"><Badge tone={log.severity}>{log.severity}</Badge></td>
                  <td className="max-w-sm truncate px-4 py-3 text-muted-foreground">{log.message ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile card list */}
        <div className="divide-y divide-border md:hidden">
          {filteredLogs.map((log) => (
            <div key={log.id} className="space-y-2 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-slate-100">{log.event_type}</span>
                <Badge tone={log.severity}>{log.severity}</Badge>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span>{log.source}</span>
                <span>{log.username ?? "system"}</span>
                {log.ip_address && <span className="font-mono text-cyan-200">{log.ip_address}</span>}
              </div>
              {log.message && <p className="truncate text-xs text-muted-foreground">{log.message}</p>}
              <p className="text-xs text-muted-foreground/60">{formatDate(log.timestamp)}</p>
            </div>
          ))}
        </div>
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No logs match the current filters.</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
