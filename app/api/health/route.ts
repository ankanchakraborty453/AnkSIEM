import { NextResponse } from "next/server";
import { createServiceClient, hasServiceRoleKey, hasSupabaseEnv } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const env = {
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    publishableKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    serviceRoleKey: hasServiceRoleKey()
  };

  if (!hasSupabaseEnv()) {
    return NextResponse.json({
      ok: false,
      env,
      database: { connected: false, message: "Supabase environment variables are missing." }
    });
  }

  const { count, error } = await createServiceClient()
    .from("logs")
    .select("id", { count: "exact", head: true });

  return NextResponse.json({
    ok: !error,
    env,
    database: {
      connected: !error,
      logsIndexed: count ?? 0,
      message: error?.message ?? "Connected"
    }
  });
}
