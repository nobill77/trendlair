-- Founder clicks tracking table
-- Run in: Supabase → SQL Editor → New Query

CREATE TABLE IF NOT EXISTS founder_clicks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source text DEFAULT 'trendlair',
  destination text DEFAULT 'lexplair',
  clicked_at timestamptz DEFAULT now()
);

ALTER TABLE founder_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON founder_clicks FOR ALL
  TO service_role
  USING (true);
