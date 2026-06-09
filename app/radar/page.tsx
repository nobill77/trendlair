import { supabase } from "@/lib/supabase";
import type { Item } from "@/lib/supabase";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Opportunity Radar — Find High-Signal Tools Before They Go Mainstream | Trendlair",
  description: "Discover tools, repos, and launches with the highest opportunity score — high momentum, low saturation. Updated every 6 hours.",
  alternates: { canonical: "https://trendlair.com/radar" },
};

export const revalidate = 21600; // 6 hours

// ── Opportunity Score ─────────────────────────────────────────────────────────
// High trend_score + recent creation + not too viral yet = high opportunity
function opportunityScore(item: Item): number {
  const now      = Date.now();
  const created  = new Date(item.created_at).getTime();
  const ageHours = (now - created) / (1000 * 60 * 60);

  const trendSignal   = Math.min(item.trend_score / 10, 100);       // 0-100
  const freshnessBonus = ageHours < 24 ? 30 : ageHours < 72 ? 15 : ageHours < 168 ? 5 : 0;
  const starsBonus    = item.stars && item.stars > 100 && item.stars < 5000 ? 20 : 0; // sweet spot
  const votesBonus    = item.votes && item.votes > 50 && item.votes < 500 ? 15 : 0;

  return Math.round(Math.min(trendSignal + freshnessBonus + starsBonus + votesBonus, 100));
}

function opportunityLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: "🔥 Hot Opportunity",   color: "#f97316", bg: "rgba(249,115,22,0.08)" };
  if (score >= 60) return { label: "⚡ Rising Fast",       color: "#eab308", bg: "rgba(234,179,8,0.08)"  };
  if (score >= 40) return { label: "📈 Worth Watching",    color: "#22c55e", bg: "rgba(34,197,94,0.08)"  };
  return              { label: "💡 Early Signal",          color: "#6366f1", bg: "rgba(99,102,241,0.08)" };
}

function formatAge(createdAt: string): string {
  const hours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  if (hours < 1)  return "< 1h ago";
  if (hours < 24) return `${Math.round(hours)}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const SOURCE_ICON: Record<string, string> = {
  github: "⚫", hackernews: "🟠", product_hunt: "🔴", reddit: "🟤"
};

// ── Category Filters ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",          label: "All",           desc: "Every high-opportunity item"         },
  { id: "ai",          label: "AI / ML",        desc: "Artificial intelligence tools"       },
  { id: "devtools",    label: "Dev Tools",      desc: "Tools for developers"                },
  { id: "saas",        label: "SaaS",           desc: "Software-as-a-service products"      },
  { id: "open-source", label: "Open Source",    desc: "High-momentum OSS repos"             },
  { id: "productivity",label: "Productivity",   desc: "Tools that save time"                },
];

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

export default async function RadarPage({ searchParams }: Props) {
  const params    = await searchParams;
  const activecat = params.cat || "all";

  // نجيب أعلى 200 item بـ trend_score من آخر 7 أيام
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  let query = supabase
    .from("items")
    .select("*")
    .gte("created_at", since7d)
    .order("trend_score", { ascending: false })
    .limit(200);

  if (activecat !== "all") {
    query = query.contains("tags", [activecat]);
  }

  const { data: rawItems } = await query;
  const items = rawItems || [];

  // احسب الـ opportunity score وفلتر > 30
  const scored = items
    .map(item => ({ ...item, oScore: opportunityScore(item) }))
    .filter(item => item.oScore >= 30)
    .sort((a, b) => b.oScore - a.oScore)
    .slice(0, 50);

  // Stats
  const hotCount  = scored.filter(i => i.oScore >= 80).length;
  const risingCount = scored.filter(i => i.oScore >= 60 && i.oScore < 80).length;

  return (
    <main style={{ minHeight: "100vh", paddingTop: "72px" }}>

      {/* ── Hero ── */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, transparent, #6366f1, transparent)"
        }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 20px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "32px" }}>📡</span>
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#6366f1", marginBottom: "4px" }}>
                Opportunity Radar
              </p>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700, color: "var(--white)", lineHeight: 1.2, margin: 0 }}>
                High-Signal Finds
              </h1>
            </div>
          </div>
          <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.7, maxWidth: "600px", marginBottom: "24px" }}>
            Tools and repos trending hard in the last 7 days — scored by momentum, freshness, and growth velocity. Find them before everyone else does.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { label: "Hot Opportunities", value: hotCount,   color: "#f97316" },
              { label: "Rising Fast",       value: risingCount, color: "#eab308" },
              { label: "Total Tracked",     value: scored.length, color: "#6366f1" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ border: "1px solid var(--border)", background: "var(--surface)", padding: "12px 20px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 700, color }}>{value}</div>
                <div style={{ fontSize: "10px", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category filter ── */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", gap: "0", overflowX: "auto" }}>
          {CATEGORIES.map(cat => (
            <Link key={cat.id} href={cat.id === "all" ? "/radar" : `/radar?cat=${cat.id}`}
              style={{
                padding: "14px 20px",
                fontSize: "12px",
                fontWeight: 600,
                color: activecat === cat.id ? "#6366f1" : "var(--dim)",
                borderBottom: activecat === cat.id ? "2px solid #6366f1" : "2px solid transparent",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "color 0.2s",
              }}>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Items grid ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>

        {scored.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--dim)" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>📡</p>
            <p style={{ fontSize: "16px" }}>No high-signal items in this category yet.</p>
            <Link href="/radar" style={{ color: "#6366f1", textDecoration: "none", fontSize: "13px" }}>
              ← View all categories
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {scored.map((item, idx) => {
              const opp    = opportunityLabel(item.oScore);
              const srcIcon = SOURCE_ICON[item.source || "github"] || "⚫";

              return (
                <Link key={item.id} href={`/item/${item.slug}`}
                  style={{ textDecoration: "none" }}>
                  <div style={{
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    padding: "20px 24px",
                    display: "grid",
                    gridTemplateColumns: "48px 1fr auto",
                    gap: "16px",
                    alignItems: "center",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#6366f1")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>

                    {/* Rank */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 700, color: "var(--dim)" }}>
                        {idx + 1}
                      </div>
                      <div style={{ fontSize: "18px", marginTop: "4px" }}>{srcIcon}</div>
                    </div>

                    {/* Content */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em",
                          textTransform: "uppercase", color: opp.color,
                          border: `1px solid ${opp.color}40`,
                          background: opp.bg, padding: "2px 8px",
                        }}>
                          {opp.label}
                        </span>
                        <span style={{ fontSize: "10px", color: "var(--dim)" }}>
                          {formatAge(item.created_at)}
                        </span>
                      </div>

                      <h2 style={{
                        fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 700,
                        color: "var(--white)", margin: "0 0 4px", lineHeight: 1.3,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {item.title}
                      </h2>

                      {item.description && (
                        <p style={{
                          fontSize: "12px", color: "var(--muted)", margin: "0 0 8px",
                          overflow: "hidden", textOverflow: "ellipsis",
                          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                        }}>
                          {item.description}
                        </p>
                      )}

                      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        {item.stars && item.stars > 0 && (
                          <span style={{ fontSize: "11px", color: "var(--dim)" }}>
                            ⭐ {item.stars.toLocaleString()} stars
                          </span>
                        )}
                        {item.votes && item.votes > 0 && (
                          <span style={{ fontSize: "11px", color: "var(--dim)" }}>
                            👍 {item.votes} votes
                          </span>
                        )}
                        {item.tags?.slice(0, 3).map((tag: string) => (
                          <span key={tag} style={{
                            fontSize: "10px", color: "var(--dim)",
                            border: "1px solid var(--border)", padding: "1px 6px",
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Score */}
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div style={{
                        width: "52px", height: "52px", borderRadius: "50%",
                        border: `2px solid ${opp.color}`,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontSize: "16px", fontWeight: 700, color: opp.color, lineHeight: 1 }}>
                          {item.oScore}
                        </span>
                        <span style={{ fontSize: "8px", color: "var(--dim)", textTransform: "uppercase" }}>
                          opp
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Methodology */}
        <div style={{
          marginTop: "48px", padding: "24px",
          border: "1px solid var(--border)", background: "var(--surface)",
          fontSize: "12px", color: "var(--dim)", lineHeight: 1.8,
        }}>
          <p style={{ fontWeight: 700, color: "var(--white)", marginBottom: "8px" }}>How the Opportunity Score Works</p>
          <p>
            Items are scored 0-100 based on: <strong style={{ color: "var(--muted)" }}>trend momentum</strong> (from GitHub stars, HN points, PH votes),
            <strong style={{ color: "var(--muted)" }}> freshness</strong> (items under 24h get a bonus),
            and <strong style={{ color: "var(--muted)" }}>sweet-spot growth</strong> (too popular = saturated, too small = no signal).
            Updated every 6 hours. 🔥 Hot = score 80+, ⚡ Rising = 60-79, 📈 Watching = 40-59.
          </p>
        </div>
      </div>
    </main>
  );
}
