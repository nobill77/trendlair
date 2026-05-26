-- ===================================================
-- Discovery Engine — Supabase Database Setup
-- Run this in: Supabase → SQL Editor → New Query
-- ===================================================

-- 1. Create the main items table
create table if not exists items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  type text default 'repo',
  url text,
  github_url text,
  image text,
  tags text[] default '{}',
  trend_score numeric default 0,
  stars integer default 0,
  slug text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Index for fast tag filtering
create index if not exists items_tags_idx on items using gin(tags);
create index if not exists items_trend_idx on items(trend_score desc);
create index if not exists items_slug_idx on items(slug);
create index if not exists items_type_idx on items(type);

-- 3. Enable Row Level Security (RLS)
alter table items enable row level security;

-- 4. Allow public read access (anyone can view items)
create policy "Public read access"
  on items for select
  to anon
  using (true);

-- 5. Allow service role to insert/update (for the fetcher script)
create policy "Service role full access"
  on items for all
  to service_role
  using (true);

-- 6. Auto-update the updated_at field
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger items_updated_at
  before update on items
  for each row execute function update_updated_at();

-- 7. View to get trending items with tag filtering
create or replace view trending_items as
  select * from items
  order by trend_score desc, created_at desc;

-- Done! ✅
-- Now fill in your .env.local and run: npm run fetch-data
