// Returns fetch-pipeline priority recommendations based on current items data.
// Answers: which sources are stale, which tags are trending, what to fetch next.
// No auth required — response contains only aggregate public data.

export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type SourceStats = {
  source: string;
  total_items: number;
  last_24h: number;
  last_7d: number;
  avg_score: number;
  staleness_score: number; // higher = more urgently needs refresh
};

type TagStats = {
  tag: string;
  count: number;
  avg_score: number;
  recent_count: number; // items in last 7d
  trend_velocity: number; // recent_count / count ratio
};

export async function GET() {
  try {
    const now = new Date();
    const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const ago7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch all items with source, score, tags, created_at
    const { data: items, error } = await supabase
      .from("items")
      .select("source, trend_score, tags, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!items?.length) {
      return NextResponse.json({ sources: [], tags: [], generated_at: now.toISOString() });
    }

    // ── Source analysis ─────────────────────────────────────────────────
    const sourceMap = new Map<string, { total: number; h24: number; d7: number; scores: number[] }>();
    for (const item of items) {
      const src = item.source ?? "unknown";
      if (!sourceMap.has(src)) sourceMap.set(src, { total: 0, h24: 0, d7: 0, scores: [] });
      const s = sourceMap.get(src)!;
      s.total++;
      s.scores.push(item.trend_score ?? 0);
      if (item.created_at > ago24h) s.h24++;
      if (item.created_at > ago7d) s.d7++;
    }

    const sources: SourceStats[] = Array.from(sourceMap.entries()).map(([source, s]) => {
      const avg_score = s.scores.length ? s.scores.reduce((a, b) => a + b, 0) / s.scores.length : 0;
      // Staleness: fewer recent items relative to total = more stale
      const freshness = s.total > 0 ? s.d7 / s.total : 0;
      const staleness_score = Math.round((1 - freshness) * 100);
      return {
        source,
        total_items: s.total,
        last_24h: s.h24,
        last_7d: s.d7,
        avg_score: Math.round(avg_score * 10) / 10,
        staleness_score,
      };
    }).sort((a, b) => b.staleness_score - a.staleness_score);

    // ── Tag analysis ─────────────────────────────────────────────────────
    const tagMap = new Map<string, { count: number; scores: number[]; recent: number }>();
    for (const item of items) {
      for (const tag of item.tags ?? []) {
        if (!tagMap.has(tag)) tagMap.set(tag, { count: 0, scores: [], recent: 0 });
        const t = tagMap.get(tag)!;
        t.count++;
        t.scores.push(item.trend_score ?? 0);
        if (item.created_at > ago7d) t.recent++;
      }
    }

    const tags: TagStats[] = Array.from(tagMap.entries())
      .filter(([, t]) => t.count >= 3) // ignore noise
      .map(([tag, t]) => {
        const avg_score = t.scores.reduce((a, b) => a + b, 0) / t.scores.length;
        const trend_velocity = t.count > 0 ? t.recent / t.count : 0;
        return {
          tag,
          count: t.count,
          avg_score: Math.round(avg_score * 10) / 10,
          recent_count: t.recent,
          trend_velocity: Math.round(trend_velocity * 100) / 100,
        };
      })
      .sort((a, b) => b.avg_score * b.trend_velocity - a.avg_score * a.trend_velocity)
      .slice(0, 30);

    // ── Recommendations ───────────────────────────────────────────────────
    const stalestSource = sources[0]?.source ?? null;
    const trendingTags = tags.slice(0, 5).map(t => t.tag);
    const highValueTags = [...tags]
      .sort((a, b) => b.avg_score - a.avg_score)
      .slice(0, 5)
      .map(t => t.tag);

    return NextResponse.json({
      generated_at: now.toISOString(),
      total_items: items.length,
      recommendations: {
        fetch_next: stalestSource,
        trending_tags: trendingTags,
        high_value_tags: highValueTags,
        reason: stalestSource
          ? stalestSource + " has the fewest recent items — prioritize fetching from this source"
          : "All sources are fresh",
      },
      sources,
      tags,
    });
  } catch (err) {
    console.error("[api/brain/priority]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
