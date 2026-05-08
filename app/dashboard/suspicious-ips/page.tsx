import { SuspiciousIPTable } from "@/components/dashboard/SuspiciousIPTable";
import { getSuspiciousIps } from "@/lib/data";

export default async function SuspiciousIpsPage() {
  const ips = await getSuspiciousIps();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Suspicious IPs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Risk scoring and watchlist status by source address.</p>
      </div>
      <SuspiciousIPTable ips={ips} />
    </div>
  );
}
