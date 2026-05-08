import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServiceClient, hasServiceRoleKey, hasSupabaseEnv } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getConnectionStatus() {
  if (!hasSupabaseEnv()) {
    return { connected: false, logsIndexed: 0, message: "Missing Supabase environment variables" };
  }

  const { count, error } = await createServiceClient()
    .from("logs")
    .select("id", { count: "exact", head: true });

  return {
    connected: !error,
    logsIndexed: count ?? 0,
    message: error?.message ?? "Connected"
  };
}

export default async function SettingsPage() {
  const status = await getConnectionStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Connection status and ingestion configuration.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Supabase URL</span>
            <span>{process.env.NEXT_PUBLIC_SUPABASE_URL ? "Configured" : "Missing"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Publishable key</span>
            <span>{process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configured" : "Missing"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Service role key</span>
            <span>{hasServiceRoleKey() ? "Configured" : "Using publishable RPC mode"}</span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Database</span>
            <span>{status.connected ? `Connected (${status.logsIndexed} logs)` : status.message}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ingestion endpoint</span>
            <code className="rounded bg-black/30 px-2 py-1">POST /api/ingest</code>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Runtime APIs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          {["/api/health", "/api/stats", "/api/logs", "/api/alerts", "/api/suspicious-ips"].map((endpoint) => (
            <div key={endpoint} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
              <span className="text-muted-foreground">{endpoint}</span>
              <span>Dynamic</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
