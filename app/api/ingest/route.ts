import { NextResponse } from "next/server";
import { evaluateLog } from "@/lib/detection/alertEngine";
import { createServiceClient } from "@/lib/supabase/server";
import type { NewSecurityLog, SecurityLog } from "@/types/log";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<NewSecurityLog>;

    if (!body.source || !body.event_type) {
      return NextResponse.json({ error: "source and event_type are required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const payload = {
      timestamp: body.timestamp ?? new Date().toISOString(),
      source: body.source,
      event_type: body.event_type,
      username: body.username ?? null,
      ip_address: body.ip_address ?? null,
      status: body.status ?? null,
      message: body.message ?? null,
      severity: body.severity ?? "low"
    };

    const { data, error } = await supabase.from("logs").insert(payload).select("*").single();
    if (error) throw error;

    const detection = await evaluateLog(supabase, data as SecurityLog);
    return NextResponse.json({ log: data, detection }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to ingest log" },
      { status: 500 }
    );
  }
}
