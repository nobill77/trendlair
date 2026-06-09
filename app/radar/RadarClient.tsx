"use client";
import Link from "next/link";

interface ScoredItem {
  id: string;
  title: string;
  description: string;
  slug: string;
  source?: string;
  stars?: number;
  votes?: number;
  tags?: string[];
  trend_score: number;
  created_at: string;
  oScore: number;
}

const CATEGORIES = [
  { id: "all",          label: "All"          },
  { id: "ai",           label: "AI / ML"      },
  { id: "devtools",     label: "Dev Tools"    },
  { id: "saas",         label: "SaaS"         },
  { id: "open-source",  label: "Open Source"  },
  { id: "productivity", label: "Productivity" },
];

const SOURCE_ICON: Record<string, string> = {
  github: "⚫", hackernews: "🟠", product_hunt: "🔴", reddit: "🟤",
};

function oppLabel(score: number) {
  if (score >= 80) return { label: "🔥 Hot Opportunity", color: "#f97316" };
  if (score >= 60) return { label: "⚡ Rising Fast",     color: "#eab308" };
  if (score >= 40) return { label: "📈 Worth Watching",  color: "#22c55e" };
  return               { label: "💡 Early Signal",      color: "#6366f1" };
}

function formatAge(createdAt: string): string {
  const hours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  if (hours < 1)  return "< 1h ago";
  if (hours < 24) return `${Math.round(hours)}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function RadarClient({
  items,
  activecat,
}: {
  items: ScoredItem[];
  activecat: string;
}) {
  const hotCount    = items.filter(i => i.oScore >= 80).length;
  const risingCount = items.filter(i => i.oScore >= 60 && i.oScore < 80).length;

  return (
    <main style={{ minHeight: "100vh", paddingTop: "72px" }}>

      {/* Hero */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 20px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "32px" }}>📡</span>
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em",
                textTransform: "uppercase", color: "#6366f1", marginBottom: "4px" }}>
                Opportunity Radar
              </p>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem,4vw,2.8rem)",
                fontWeight: 700, color: "var(--white)", lineHeight: 1.2, margin: 0 }}>
                High-Signal Finds
              </h1>
            </div>
          </div>
          <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.7,
            maxWidth: "600px", marginBottom: "24px" }}>
            Tools and repos trending hard in the last 7 days — scored by momentum, freshness,
            and growth velocity. Find them before everyone else does.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { label: "Hot Opportunities", value: hotCount,     color: "#f97316" },
              { label: "Rising Fast",       value: risingCount,  color: "#eab308" },
              { label: "Total Tracked",     value: items.length, color: "#6366f1" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ border: "1px solid var(--border)", background: "var(--surface)",
                padding: "12px 20px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 700, color }}>
                  {value}
                </div>
                <div style={{ fontSize: "10px", color: "var(--dim)", textTransform: "uppercase",
                  letterSpacing: "0.1em" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px",
          display: "flex", overflowX: "auto" }}>
          {CATEGORIES.map(cat => (
            <Link key={cat.id}
              href={cat.id === "all" ? "/radar" : `/radar?cat=${cat.id}`}
              style={{
                padding: "14px 20px", fontSize: "12px", fontWeight: 600,
                color: activecat === cat.id ? "#6366f1" : "var(--dim)",
                borderBottom: activecat === cat.id ? "2px solid #6366f1" : "2px solid transparent",
                textDecoration: "none", whiteSpace: "nowrap",
              }}>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Items */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--dim)" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>📡</p>
            <p style={{ fontSize: "16px" }}>No high-signal items yet. Check back in a few hours.</p>
            <Link href="/radar" style={{ color: "#6366f1", textDecoration: "none", fontSize: "13px" }}>
              ← View all categories
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {items.map((item, idx) => {
              const opp = oppLabel(item.oScore);
              const srcIcon = SOURCE_ICON[item.source || "github"] || "⚫";
              return (
                <Link key={item.id} href={`/item/${item.slug}`}
                  style={{ textDecoration: "none", display: "block" }}>
                  <div style={{
                    border: "1px solid var(--border)", background: "var(--bg)",
                    padding: "18px 24px",
                    display: "grid",
                    gridTemplateColumns: "44px 1fr 60px",
                    gap: "16px", alignItems: "center",
                  }}>
                    {/* Rank + source */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px",
                        fontWeight: 700, color: "var(--dim)" }}>
                        {idx + 1}
                      </div>
                      <div style={{ fontSize: "16px", marginTop: "2px" }}>{srcIcon}</div>
                    </div>

                    {/* Content */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px",
                        marginBottom: "5px", flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em",
                          textTransform: "uppercase", color: opp.color,
                          border: `1px solid ${opp.color}50`, padding: "1px 7px",
                        }}>
                          {opp.label}
                        </span>
                        <span style={{ fontSize: "10px", color: "var(--dim)" }}>
                          {formatAge(item.created_at)}
                        </span>
                      </div>
                      <h2 style={{
                        fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 700,
                        color: "var(--white)", margin: "0 0 4px", lineHeight: 1.3,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {item.title}
                      </h2>
                      {item.description && (
                        <p style={{
                          fontSize: "12px", color: "var(--muted)", margin: "0 0 6px",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {item.description}
                        </p>
                      )}
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {item.stars && item.stars > 0 ? (
                          <span style={{ fontSize: "11px", color: "var(--dim)" }}>
                            ⭐ {item.stars.toLocaleString()}
                          </span>
                        ) : null}
                        {item.votes && item.votes > 0 ? (
                          <span style={{ fontSize: "11px", color: "var(--dim)" }}>
                            👍 {item.votes}
                          </span>
                        ) : null}
                        {item.tags?.slice(0, 3).map((tag: string) => (
                          <span key={tag} style={{
                            fontSize: "10px", color: "var(--dim)",
                            border: "1px solid var(--border)", padding: "1px 5px",
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Score circle */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "50%",
                        border: `2px solid ${opp.color}`,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        margin: "0 auto",
                      }}>
                        <span style={{ fontSize: "15px", fontWeight: 700, color: opp.color, lineHeight: 1 }}>
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

        {/* How it works */}
        <div style={{
          marginTop: "40px", padding: "20px 24px",
          border: "1px solid var(--border)", background: "var(--surface)",
          fontSize: "12px", color: "var(--dim)", lineHeight: 1.8,
        }}>
          <p style={{ fontWeight: 700, color: "var(--white)", marginBottom: "6px" }}>
            How the Opportunity Score works
          </p>
          <p>
            Scored 0-100 based on trend momentum, freshness (items under 24h get a bonus),
            and sweet-spot growth (too viral = saturated). Updated every 6 hours.
            🔥 Hot = 80+, ⚡ Rising = 60-79, 📈 Watching = 40-59, 💡 Early = below 40.
          </p>
        </div>
      </div>
    </main>
  );
}
