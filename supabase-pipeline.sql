-- Run once in Supabase SQL Editor to enable pipeline run tracking
-- Used by /api/brain/report and scripts/github-fetch.js

CREATE TABLE IF NOT EXISTS pipeline_runs (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at     timestamptz DEFAULT now(),
  source         text        NOT NULL,           -- 'github' | 'hn' | 'producthunt' | 'reddit'
  items_fetched  int         DEFAULT 0,
  items_new      int         DEFAULT 0,
  items_updated  int         DEFAULT 0,
  top_tags       text[]      DEFAULT '{}',
  errors         jsonb       DEFAULT '[]'
);

ALTER TABLE pipeline_runs ENABLE ROW LEVEL SECURITY;
-- No public access — service role only
