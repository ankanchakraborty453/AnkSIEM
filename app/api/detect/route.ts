import { NextResponse } from "next/server";
import { evaluateLog } from "@/lib/detection/alertEngine";
import { createServiceClient } from "@/lib/supabase/server";
import type { SecurityLog } from "@/types/log";

export async function POST(request: Request) {
  try {
    const { logId } = (await request.json()) as { logId?: string };
    if (!logId) return NextResponse.json({ error: "logId is required" }, { status: 400 });

    const supabase = createServiceClient();
    const { data, error } = await supabase.from("logs").select("*").eq("id", logId).single();
    if (error) throw error;

    const detection = await evaluateLog(supabase, data as SecurityLog);
    return NextResponse.json({ detection });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to run detection" },
      { status: 500 }
    );
  }
}
