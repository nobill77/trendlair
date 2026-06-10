# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Ecosystem Overview

Two sibling Next.js projects owned by **nobill77**, sharing the same Supabase instance, Vercel team, and GitHub token:

| Project | Repo | Domain | Purpose |
|---|---|---|---|
| **Lexplair** | nobill77/Lexplair | lexplair.com | Legal/education content platform (4-door, automated Brain) |
| **Trendlair** | nobill77/trendlair | trendlair.com | Tech trend discovery — GitHub/HN/PH/Reddit aggregator |

Both repos live locally at `C:\Users\Super-Magic\Lexplair` and `C:\Users\Super-Magic\trendlair`.

---

## Commands

### Lexplair (run from `lexplair-v2/`)
```bash
npm run dev          # dev server
npm run build        # production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit (doesn't fail CI — see next.config.js)
python core.py       # run one Brain session manually (from repo root)
```

### Trendlair (run from repo root)
```bash
npm run dev          # dev server
npm run build        # production build
node scripts/github-fetch.js      # fetch GitHub + HN + Product Hunt data
node scripts/normalize-scores.js  # re-normalize trend_scores in Supabase
node scripts/send-newsletter.js   # send weekly newsletter (requires RESEND_API_KEY)
node scripts/send-alerts.js       # send radar alerts to subscribers
```

---

## Shared Infrastructure

### Supabase
Both projects connect to the **same Supabase instance** (`hefcrjxqsokcmwqytaws.supabase.co`).

| Table | Owner | Purpose |
|---|---|---|
| `items` | Trendlair | Trending repos/tools/articles from GitHub, HN, PH, Reddit |
| `newsletter_subscribers` | Trendlair | Email list; `unsubscribed` boolean for opt-out |
| `trend_alerts` | Trendlair | Radar alert subscribers; stores `tags[]` and `min_score` per user |
| `founder_clicks` | Shared | Tracks clicks from Trendlair → Lexplair for cross-project analytics |
| Auth tables | Lexplair | Supabase auth via `@supabase/ssr` |

Lexplair uses three Supabase client variants: `src/lib/supabase/client.ts` (browser), `server.ts` (server), `admin.ts` (service key). Trendlair uses `lib/supabase.ts` (anon) and the service key directly in scripts.

### Vercel
Both projects deploy to the same Vercel team (`team_1oNliDboVh2cp2ffS5F5e2CQ`).
- Lexplair project ID: `prj_FQIvyaJTaXINbrU259Y9T0zgkw1r`
- Trendlair project name: `trendlair` (resolved via `vercel link`)

### Email — Resend
Both use Resend for transactional email. Lexplair sends purchase confirmations and welcome emails; Trendlair sends the weekly newsletter (`newsletter@trendlair.com`) and radar alerts (`radar@trendlair.com`).

### Analytics
- Lexplair: `G-YNK99C378K`
- Trendlair: `G-J65BEX7GRP`

---

## Lexplair Architecture

### The 4-Door Content System
Content is organized into four "doors", each with its own URL namespace and content directory:

| Door | URL | Content dir | File structure |
|---|---|---|---|
| us-business | /articles/[slug]/ | `content/articles/` | flat `.md` files |
| us-state-laws | /us-state-laws/[topic]/[state]/ | `content/us-state-laws/[topic]/` | `_hub.md` + `[state].md` per topic folder |
| europe | /europe/[country]/[topic]/ | `content/europe/[country]/` | `_hub.md` + `[topic].md` per country folder |
| study-abroad | /study-abroad/[country]/[topic]/ | `content/study-abroad/[country]/` | same as europe |

Hub articles (filename `_hub.md`) are aggregate comparison pages. `src/lib/articles.ts:parseFile()` derives `slug`, `urlPath`, `topic`, `state`, `country`, and `isHub` from the file path relative to each door's root directory. Nested slugs are encoded flat as `topic--state` or `country--topic`.

### Brain — Automated Content Engine
`core.py` (root) runs every 2 hours via `brain.yml`. Each session:
1. Loads `MASTER_BLUEPRINT.md` + `SYSTEM_PROMPT.md` as context
2. Calls `preflight_check()` — fixes queue, adds missing articles/tools from each door's `config.json`
3. Calls `heal_previous_deploy_errors()` — auto-repairs logged TS/deploy failures
4. Calls OpenRouter API (Gemini 2.5 Flash) to write 3 articles or tool components
5. Saves `.md` to `lexplair-v2/content/` and `.tsx` tool components to `lexplair-v2/src/components/tools/`
6. Commits with `content:` prefix and pushes to main

CTA assignment (`_pick_cta_product`, `_pick_cta_tool`) scores article titles against keyword maps (`PRODUCT_MAP`, `TOOL_MAP`) in `core.py` to auto-select the best product and tool slug for each article's frontmatter. `TOOL_MAP` covers all 22 live tools — see `MASTER_BLUEPRINT.md` for the full tool catalog and ctaTool selection rules.

### Lexplair Deploy Pipeline (`deploy.yml`)
Only deploys when commit message starts with `content:`, `feat:`, `fix:`, or `Brain session`. All `vercel` commands run from `lexplair-v2/` (set via `defaults: run: working-directory`). Before deploying, CI removes any `.tsx` containing `dangerouslySetInnerHTML` (common Brain tool bug) and strips remaining TS errors file-by-file. `next.config.js` sets `ignoreBuildErrors: true` for the same reason.

### Lexplair Key Files
- `core.py` — Brain engine (2200+ lines)
- `MASTER_BLUEPRINT.md` — vision, product catalog, architecture (read by Brain each session)
- `SYSTEM_PROMPT.md` — writing instructions injected into every AI call
- `PRODUCT_SYSTEM.md` — pricing tiers and product-to-article mapping rules
- `lexplair-v2/src/lib/articles.ts` — article parsing and routing logic
- `lexplair-v2/src/data/tools.ts` — tool registry
- `lexplair-v2/src/data/products.ts` — product catalog with Stripe price IDs
- `lexplair-v2/src/app/tools/[slug]/page.tsx` — tool renderer with `STATIC_COMPONENTS` map (22 tools registered; all hand-written tools must be added here)
- `lexplair-v2/content/[door]/config.json` — per-door Brain configuration
- `status.json` — Brain's task queue and session state (repo root)
- `.last_task` — last completed task name, used in git commit messages

### Lexplair Content Frontmatter
```yaml
---
title: "..."
description: "..."
date: "2025-06-08"
door: "us-state-laws"
topic: "llc-formation"
state: "delaware"        # us-state-laws only
country: "uk"            # europe / study-abroad only
isHub: true              # hub articles only
urlPath: "/us-state-laws/llc-formation/delaware/"
sources_verified: true
ctaProduct: "delaware-llc-kit"
ctaTool: "llc-formation-cost-calculator"
---
```
Every article must end with a legal disclaimer and a `## Sources` section citing official government sources (`.gov`, `.europa.eu`).

---

## Trendlair Architecture

### Data Pipeline
Runs every 6 hours via `fetch-data.yml`. Scripts execute in order:
1. `github-fetch.js` — GitHub search API (trending topics) + HackerNews top stories + Product Hunt top posts → upsert into `items` by `external_id`
2. `producthunt-fetch.js` — supplemental PH fetch
3. `reddit-fetch.js` — Reddit trending posts
4. `normalize-scores.js` — re-normalizes `trend_score` per source (GitHub: stars÷10 capped 1000; HN: score×3; PH: votes×5; Reddit: score×4)
5. `send-alerts.js` — calculates `opportunityScore` (trend signal + freshness + star range bonus) and emails subscribers with score ≥ threshold

Weekly newsletter (`newsletter.yml`) fires every Sunday at 09:00 UTC — fetches top 10 `items` from the past 7 days by `trend_score` and sends to all active `newsletter_subscribers` via Resend.

### Trendlair App Pages
| Route | Purpose |
|---|---|
| `/discover` | Main feed; filter by tag/type/source/search; 4 curated scroll sections on default view |
| `/item/[slug]` | Single item detail |
| `/radar` | Opportunity radar — high-signal items by `opportunityScore` |
| `/alerts` | Manage radar alert subscriptions |
| `/workflows` | Waitlist page for planned AI workflow automation feature |
| `/bookmarks` | Saved items (auth required) |

### Trendlair Deploy (`deploy.yml`)
Triggers on every push to main. Uses `vercel link --project=trendlair` (no `.vercel/project.json` needed). Two build attempts with 30s retry. No commit-message filter.

### Trendlair Key Files
- `lib/supabase.ts` — anon client + `Item` type definition
- `lib/supabase-browser.ts` — browser client
- `scripts/github-fetch.js` — primary data ingestion (GitHub + HN + PH)
- `supabase-setup.sql` — main `items` table schema
- `supabase-newsletter.sql` — `newsletter_subscribers` table
- `supabase-founder-clicks.sql` — `founder_clicks` cross-project tracking table

---

## Known Issues & Fixes

### Lexplair — Brain-generated TypeScript
Brain writes `.tsx` via Python — template literals break because Python escapes backticks. Use string concatenation in any file Brain touches:
```typescript
// Wrong:  `Bearer ${KEY}`
// Correct: "Bearer " + KEY
```

### Lexplair — Vercel project.json
`lexplair-v2/.vercel/project.json` must always contain:
```json
{"orgId": "team_1oNliDboVh2cp2ffS5F5e2CQ", "projectId": "prj_FQIvyaJTaXINbrU259Y9T0zgkw1r"}
```

### Lexplair — TypeScript rules
- Any function calling `getAllArticles`/`getArticleBySlug` must be `async`
- Optional frontmatter fields (`?` in `ArticleMeta`) require `?.` access everywhere
- Always `return notFound()`, never bare `notFound()`
- State filter tools must include all 50 US states — never a partial list

### Lexplair — Tool registration (hand-written tools)
Every tool component written by hand (not Brain) needs three things:
1. `comingSoon: false` in `lexplair-v2/src/data/tools.ts`
2. Named import added to `lexplair-v2/src/app/tools/[slug]/page.tsx`
3. Entry in the `STATIC_COMPONENTS` map in that same file

Brain-generated tools use the dynamic import fallback (`@/components/tools/{ComponentName}`) and do NOT need manual registration — but CI deletes any Brain tool containing `dangerouslySetInnerHTML`, so Brain tools must use native React (`useState`) only. Never use `dangerouslySetInnerHTML` in any tool component.

### Lexplair — ctaTool frontmatter
Article frontmatter `ctaTool` must be a slug that exists in `tools.ts`. If the slug is missing, the article CTA silently disappears. Valid slugs are in `MASTER_BLUEPRINT.md` → Tool Catalog. When adding a new planned tool slug to content, also add a `comingSoon: true` stub to `tools.ts` so the CTA renders.

### Trendlair — `searchParams` is a Promise in Next.js 16
```typescript
// Correct (Next.js 16):
const params = await searchParams;
```

### Trendlair — Score normalization
Raw scores stored by fetchers may be un-normalized (stars direct from API). Always run `normalize-scores.js` after bulk imports to keep `trend_score` on the 0–1000 scale.

### Trendlair — Supabase env var naming (two environments)
Two different names are used intentionally — they are **not** a bug:
- `SUPABASE_SERVICE_KEY` — GitHub Actions Secret; used by all scripts in `scripts/` and referenced in `fetch-data.yml` + `newsletter.yml`
- `SUPABASE_SERVICE_ROLE_KEY` — Vercel env var; used by Next.js API routes in `app/api/`

### Trendlair — founder_clicks table
The `founder_clicks` table is created once via `supabase-founder-clicks.sql` (run manually in Supabase SQL Editor). Do **not** attempt runtime DDL — the `exec_sql` RPC function does not exist in standard Supabase. The `app/api/track-founder-click/route.ts` handler just inserts directly.

---

## Environment / Secrets

### Lexplair — GitHub Secrets
| Secret | Used by |
|---|---|
| `LEXPLAIR_TOKEN` | Brain push + GitHub API reads/writes |
| `OPENROUTER_API_KEY` | Brain AI calls |
| `VERCEL_TOKEN` | Deploy |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Optional GSC insights in Brain |

Brain reads these from `brain.env` (created by CI at runtime, not committed).

### Trendlair — GitHub Secrets
| Secret | Used by |
|---|---|
| `GH_TOKEN` | GitHub fetch API |
| `NEXT_PUBLIC_SUPABASE_URL` | All scripts + app |
| `SUPABASE_SERVICE_KEY` | Scripts (write access) |
| `PRODUCT_HUNT_TOKEN` | PH GraphQL API |
| `RESEND_API_KEY` | Newsletter + alerts |
| `VERCEL_TOKEN` | Deploy |

### Local development
Copy `.env.local.example` → `.env.local` (Lexplair: in `lexplair-v2/`; Trendlair: root).

---

## Git Remotes (in Lexplair working directory)
```
origin    → https://github.com/nobill77/Lexplair.git   (primary)
trendlair → https://github.com/nobill77/trendlair.git  (secondary — push CLAUDE.md updates here)
```
To push CLAUDE.md to trendlair after updating it here, copy the file to `C:\Users\Super-Magic\trendlair\CLAUDE.md`, then commit and push from that directory.
