"use client";

import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const severityColors: Record<string, string> = {
  low: "#34d399",
  medium: "#f59e0b",
  high: "#fb923c",
  critical: "#f87171"
};

export function ThreatActivityChart({ data }: { data: Array<{ time: string; failures: number; alerts: number }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Activity</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
            <Line type="monotone" dataKey="failures" stroke="#22d3ee" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="alerts" stroke="#fb7185" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SeverityChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts by Severity</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={92} paddingAngle={4}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={severityColors[entry.name] ?? "#22d3ee"} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function EventDistributionChart({ data }: { data: Array<{ name: string; count: number }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Type Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
            <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TopIpsChart({ data }: { data: Array<{ name: string; score: number; failedAttempts: number }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Suspicious IPs</CardTitle>
      </CardHeader>
      <CardContent className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid stroke="#1e293b" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={80} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b" }} />
            <Bar dataKey="score" fill="#fb7185" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
