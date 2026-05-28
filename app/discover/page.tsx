import { supabase } from "@/lib/supabase";
import type { Item } from "@/lib/supabase";
import ItemCard from "@/components/ItemCard";
import ScrollSection from "@/components/ScrollSection";

interface DiscoverPageProps {
  searchParams: Promise<{ tag?: string; type?: string; q?: string; sort?: string; source?: string }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const params = await searchParams;
  const activeTag = params.tag;
  const activeType = params.type;
  const searchQuery = params.q;
  const sortOrder = params.sort;
  const activeSource = params.source;

  let query = supabase
    .from("items")
    .select("*")
    .order(sortOrder === "new" ? "created_at" : "trend_score", { ascending: false })
    .limit(150);

  if (activeTag) query = query.contains("tags", [activeTag]);
  if (activeType) query = query.eq("type", activeType);
  if (activeSource) query = query.eq("source", activeSource);
  if (searchQuery) query = query.ilike("title", `%${searchQuery}%`);

  const { data: items } = await query;

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [
    { data: trendingHour },
    { data: trending },
    { data: justLaunched },
    { data: hiddenGems },
  ] = await Promise.all([
    supabase.from("items").select("*").gte("updated_at", since24h).order("trend_score", { ascending: false }).limit(10),
    supabase.from("items").select("*").order("trend_score", { ascending: false }).limit(5),
    supabase.from("items").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("items").select("*").gt("stars", 1000).lt("trend_score", 50).limit(5),
  ]);

  const linkStyle = (active: boolean) => ({
    padding: "6px 16px",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
    color: active ? "var(--accent)" : "var(--muted)",
    borderRadius: "100px",
    textDecoration: "none",
    transition: "all 0.2s",
  });

  const isDefault = !activeType && !activeTag && !sortOrder && !searchQuery && !activeSource;

  return (
    <main style={{ minHeight: "100vh", padding: "calc(56px + 3rem) 2rem 4rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.5rem", fontWeight: 700 }}>
          / Discover
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1, marginBottom: "1.5rem" }}>
          Trending Now
        </h1>

        {/* Search */}
        <form method="GET" style={{ marginBottom: "1.5rem" }}>
          <div style={{ position: "relative", maxWidth: "500px" }}>
            <input
              name="q"
              defaultValue={searchQuery}
              placeholder="Search..."
              style={{ width: "100%", padding: "10px 16px 10px 40px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "13px", outline: "none", fontFamily: "var(--font-mono)" }}
            />
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>🔍</span>
          </div>
        </form>

        {/* Intent Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <a href="/discover" style={linkStyle(isDefault)}>🔥 Trending</a>
          <a href="/discover?sort=new" style={linkStyle(sortOrder === "new")}>✨ New</a>
          <a href="/discover?tag=ai" style={linkStyle(activeTag === "ai")}>🤖 AI</a>
          <a href="/discover?type=tool" style={linkStyle(activeType === "tool")}>🚀 Tools</a>
          <a href="/discover?type=repo" style={linkStyle(activeType === "repo")}>📖 Open Source</a>
          <a href="/discover?type=article" style={linkStyle(activeType === "article")}>📰 Articles</a>
          <a href="/discover?source=reddit" style={linkStyle(params.source === "reddit")}>🟤 Reddit</a>
        </div>

        <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "1rem" }}>
          {items?.length ?? 0} items · {sortOrder === "new" ? "Sorted by date" : "Sorted by stars & momentum"}
        </p>
      </div>

      {isDefault && (
        <div style={{ marginBottom: "3rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <ScrollSection title="⚡ Trending This Hour" items={trendingHour ?? []} updatedAt={trendingHour?.[0]?.updated_at} />
          <ScrollSection title="🔥 Trending Now"       items={trending      ?? []} />
          <ScrollSection title="✨ Just Launched"      items={justLaunched  ?? []} />
          <ScrollSection title="💎 Hidden Gems"        items={hiddenGems    ?? []} />
          <div style={{ height: "1px", background: "var(--border)" }} />
        </div>
      )}

      {!items || items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "6rem 2rem", border: "1px dashed var(--border)", borderRadius: "16px" }}>
          <div style={{ fontSize: "48px", marginBottom: "1rem" }}>🔍</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem" }}>No results found</h2>
          <a href="/discover" style={{ color: "var(--accent)", textDecoration: "none", fontSize: "13px" }}>Clear search →</a>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {items.map((item: Item, i: number) => (
            <ItemCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
