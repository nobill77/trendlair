-- Newsletter subscribers table for Trendlair
-- Run in: Supabase → SQL Editor

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  source text DEFAULT 'trendlair',
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed boolean DEFAULT false
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON newsletter_subscribers FOR ALL
  TO service_role USING (true);

CREATE INDEX IF NOT EXISTS newsletter_email_idx ON newsletter_subscribers(email);
