import { getLogs } from "@/lib/data";

function csvEscape(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const logs = await getLogs();
  const headers = ["timestamp", "source", "event_type", "username", "ip_address", "status", "severity", "message"];
  const rows = logs.map((log) => headers.map((key) => csvEscape(log[key as keyof typeof log])).join(","));
  const csv = [headers.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=anksiem-logs.csv"
    }
  });
}
