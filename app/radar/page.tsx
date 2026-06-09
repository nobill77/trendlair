import { supabase } from "@/lib/supabase";
import type { Item } from "@/lib/supabase";
import type { Metadata } from "next";
import Link from "next/link";
import RadarClient from "./RadarClient";

export const metadata: Metadata = {
  title: "Opportunity Radar — High-Signal Tools Before They Go Mainstream | Trendlair",
  description: "Discover tools trending hard this week, scored by momentum and freshness. Updated every 6 hours.",
  alternates: { canonical: "https://trendlair.com/radar" },
};

export const revalidate = 21600;

function opportunityScore(item: Item): number {
  const now      = Date.now();
  const created  = new Date(item.created_at).getTime();
  const ageHours = (now - created) / (1000 * 60 * 60);
  const trendSignal    = Math.min(item.trend_score / 10, 100);
  const freshnessBonus = ageHours < 24 ? 30 : ageHours < 72 ? 15 : ageHours < 168 ? 5 : 0;
  const starsBonus     = item.stars && item.stars > 100 && item.stars < 5000 ? 20 : 0;
  const votesBonus     = item.votes && item.votes > 50  && item.votes < 500  ? 15 : 0;
  return Math.round(Math.min(trendSignal + freshnessBonus + starsBonus + votesBonus, 100));
}

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

export default async function RadarPage({ searchParams }: Props) {
  const params    = await searchParams;
  const activecat = params.cat || "all";
  const since7d   = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  let query = supabase
    .from("items")
    .select("*")
    .gte("created_at", since7d)
    .order("trend_score", { ascending: false })
    .limit(200);

  if (activecat !== "all") {
    query = query.contains("tags", [activecat]);
  }

  const { data: rawItems, error } = await query;

  if (error) {
    console.error("Radar query error:", error);
  }

  const items = rawItems || [];

  const scored = items
    .map(item => ({ ...item, oScore: opportunityScore(item) }))
    .filter(item => item.oScore >= 30)
    .sort((a, b) => b.oScore - a.oScore)
    .slice(0, 50);

  return <RadarClient items={scored} activecat={activecat} />;
}
