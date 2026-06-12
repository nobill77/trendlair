export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { createAdminClient } from "@/lib/supabase-admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email, source: source || "trendlair", subscribed_at: new Date().toISOString() },
        { onConflict: "email", ignoreDuplicates: true }
      );

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
