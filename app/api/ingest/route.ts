import { NextResponse } from "next/server";
import { evaluateLog } from "@/lib/detection/alertEngine";
import { createServiceClient, hasServiceRoleKey } from "@/lib/supabase/server";
import type { NewSecurityLog, SecurityLog } from "@/types/log";

export const dynamic = "force-dynamic";

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

    const { data: rpcData, error: rpcError } = await supabase.rpc("ingest_security_log", {
      p_source: payload.source,
      p_event_type: payload.event_type,
      p_timestamp: payload.timestamp,
      p_username: payload.username,
      p_ip_address: payload.ip_address,
      p_status: payload.status,
      p_message: payload.message,
      p_severity: payload.severity
    });

    if (!rpcError) {
      return NextResponse.json(rpcData, { status: 201 });
    }

    if (!hasServiceRoleKey()) throw rpcError;

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
