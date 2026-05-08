import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = createServiceClient();
    let query = supabase.from("logs").select("*").order("timestamp", { ascending: false }).limit(200);

    const severity = searchParams.get("severity");
    const eventType = searchParams.get("event_type");
    const ip = searchParams.get("ip");
    const username = searchParams.get("username");

    if (severity) query = query.eq("severity", severity);
    if (eventType) query = query.eq("event_type", eventType);
    if (ip) query = query.eq("ip_address", ip);
    if (username) query = query.ilike("username", `%${username}%`);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ logs: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
