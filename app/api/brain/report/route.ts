// Called by data pipeline scripts after each fetch run to log results.
// Required Supabase table — run supabase-pipeline.sql once in SQL Editor.
//
// Auth: Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
// Scripts already have this key as SUPABASE_SERVICE_KEY (same value, different env name).

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

function authorized(req: NextRequest): boolean {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!key) return true; // dev mode
  return req.headers.get("authorization") === "Bearer " + key;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    source,
    items_fetched = 0,
    items_new = 0,
    items_updated = 0,
    top_tags = [],
    errors = [],
  } = body;

  if (!source || typeof source !== "string") {
    return NextResponse.json({ error: "source is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("pipeline_runs").insert({
    source,
    items_fetched,
    items_new,
    items_updated,
    top_tags,
    errors,
  });

  if (error) {
    console.error("[api/brain/report]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// GET: last 30 pipeline runs for monitoring
export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("pipeline_runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ runs: data });
}
