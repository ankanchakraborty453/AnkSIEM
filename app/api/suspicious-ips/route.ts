import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { data, error } = await createServiceClient()
      .from("suspicious_ips")
      .select("*")
      .order("risk_score", { ascending: false })
      .limit(100);

    if (error) throw error;
    return NextResponse.json({ suspiciousIps: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch suspicious IPs" },
      { status: 500 }
    );
  }
}
