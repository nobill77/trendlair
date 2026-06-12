export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = createAdminClient();

    await supabase.from("founder_clicks").insert({
      source: "trendlair",
      destination: "lexplair",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
