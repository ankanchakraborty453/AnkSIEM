import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  low: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  medium: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  high: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  critical: "border-red-400/30 bg-red-400/10 text-red-200",
  open: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  resolved: "border-slate-400/30 bg-slate-400/10 text-slate-200"
};

export function Badge({ children, tone }: { children: React.ReactNode; tone?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium capitalize",
        variants[tone ?? ""] ?? "border-slate-500/30 bg-slate-500/10 text-slate-200"
      )}
    >
      {children}
    </span>
  );
}
