import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "text-cyan-300"
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
  tone?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
        </div>
        <Icon className={`h-5 w-5 ${tone}`} />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{helper}</p>
    </Card>
  );
}
