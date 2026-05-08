import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ ip: string }> }
) {
  try {
    const { ip } = await params;
    const { status } = (await request.json()) as { status?: string };
    if (!status) return NextResponse.json({ error: "status is required" }, { status: 400 });

    const { data, error } = await createServiceClient().rpc("set_suspicious_ip_status", {
      p_ip_address: decodeURIComponent(ip),
      p_status: status
    });

    if (error) throw error;
    return NextResponse.json({ suspiciousIp: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update suspicious IP" },
      { status: 500 }
    );
  }
}
