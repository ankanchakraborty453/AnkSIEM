import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await createServiceClient()
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw error;
    return NextResponse.json({ alerts: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = (await request.json()) as { id?: string; status?: string };
    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    if (status === "resolved") {
      const { data, error } = await createServiceClient().rpc("resolve_alert", { p_alert_id: id });
      if (!error) return NextResponse.json({ alert: data });
    }

    const { data, error } = await createServiceClient()
      .from("alerts")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ alert: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update alert" },
      { status: 500 }
    );
  }
}
