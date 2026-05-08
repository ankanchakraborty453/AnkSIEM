import { AlertConsole } from "@/components/dashboard/AlertConsole";
import { getAlerts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const alerts = await getAlerts();
  const openAlerts = alerts.filter((alert) => alert.status === "open");
  const resolvedAlerts = alerts.filter((alert) => alert.status === "resolved");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Alerts</h1>
        <p className="mt-1 text-sm text-muted-foreground">{openAlerts.length} open alerts, {resolvedAlerts.length} resolved.</p>
      </div>
      <AlertConsole alerts={alerts} />
    </div>
  );
}
