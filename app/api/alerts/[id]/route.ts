import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = (await request.json()) as { status?: string };
    if (!status) return NextResponse.json({ error: "status is required" }, { status: 400 });

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
