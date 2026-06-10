import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const VALID_TAGS = ["ai", "devtools", "saas", "open-source", "productivity", "all"];

export async function POST(request: Request) {
  try {
    const { email, tags, minScore } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const validTags = Array.isArray(tags)
      ? tags.filter((t: string) => VALID_TAGS.includes(t))
      : ["all"];

    const { error } = await supabase
      .from("trend_alerts")
      .upsert(
        {
          email,
          tags:      validTags.length > 0 ? validTags : ["all"],
          min_score: typeof minScore === "number" ? minScore : 70,
          active:    true,
          created_at: new Date().toISOString(),
        },
        { onConflict: "email" }
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

// DELETE /api/alerts — unsubscribe from radar alerts
export async function DELETE(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from("trend_alerts")
      .update({ active: false })
      .eq("email", email);

    if (error) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
