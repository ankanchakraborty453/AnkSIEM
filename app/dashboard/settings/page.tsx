import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
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
            <span className="text-muted-foreground">Service role key</span>
            <span>{process.env.SUPABASE_SERVICE_ROLE_KEY ? "Configured" : "Missing"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ingestion endpoint</span>
            <code className="rounded bg-black/30 px-2 py-1">POST /api/ingest</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
