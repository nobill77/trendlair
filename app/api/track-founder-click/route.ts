import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create table if it doesn't exist yet
    await supabase.rpc("exec_sql", {
      query: `
        CREATE TABLE IF NOT EXISTS founder_clicks (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          source text DEFAULT 'trendlair',
          destination text DEFAULT 'lexplair',
          clicked_at timestamptz DEFAULT now()
        );
        ALTER TABLE founder_clicks ENABLE ROW LEVEL SECURITY;
        DO $$ BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies
            WHERE tablename = 'founder_clicks'
            AND policyname = 'Service role full access'
          ) THEN
            CREATE POLICY "Service role full access"
              ON founder_clicks FOR ALL TO service_role USING (true);
          END IF;
        END $$;
      `
    }).maybeSingle();

    await supabase.from("founder_clicks").insert({
      source: "trendlair",
      destination: "lexplair",
      clicked_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
