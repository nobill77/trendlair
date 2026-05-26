import { supabase } from "@/lib/supabase";
import type { Item } from "@/lib/supabase";
import ItemCard from "@/components/ItemCard";

interface DiscoverPageProps {
  searchParams: Promise<{ tag?: string; type?: string; q?: string }>;
}

const ALL_TAGS = ["ai", "machine-learning", "llm", "developer-tools", "openai"];

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const params = await searchParams;
  const activeTag = params.tag;
  const searchQuery = params.q;

  let query = supabase
    .from("items")
    .select("*")
    .order("trend_score", { ascending: false })
    .limit(60);

  if (activeTag) query = query.contains("tags", [activeTag]);
  if (searchQuery) query = query.ilike("title", `%${searchQuery}%`);

  const { data: items } = await query;

  return (
    <main style={{ minHeight: "100vh", padding: "calc(56px + 3rem) 2rem 4rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ marginBottom: "3rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.5rem", fontWeight: 700 }}>
          / Discover
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1, marginBottom: "1.5rem" }}>
          Trending Now
        </h1>

        {/* Search bar */}
        <form method="GET" style={{ marginBottom: "1.5rem" }}>
          <div style={{ position: "relative", maxWidth: "500px" }}>
            <input
              name="q"
              defaultValue={searchQuery}
              placeholder="Search repos..."
              style={{
                width: "100%",
                padding: "10px 16px 10px 40px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text)",
                fontSize: "13px",
                outline: "none",
                fontFamily: "var(--font-mono)",
              }}
            />
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: "14px" }}>🔍</span>
          </div>
        </form>

        {/* Filter tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <a href="/discover" style={{ padding: "6px 16px", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", border: `1px solid ${!activeTag ? "var(--accent)" : "var(--border)"}`, color: !activeTag ? "var(--accent)" : "var(--muted)", borderRadius: "100px", textDecoration: "none" }}>
            All
          </a>
          {ALL_TAGS.map((tag) => (
            <a key={tag} href={`/discover?tag=${tag}`} style={{ padding: "6px 16px", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", border: `1px solid ${activeTag === tag ? "var(--accent)" : "var(--border)"}`, color: activeTag === tag ? "var(--accent)" : "var(--muted)", borderRadius: "100px", textDecoration: "none" }}>
              {tag}
            </a>
          ))}
        </div>

        <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "1rem" }}>
          {items?.length ?? 0} items · Sorted by stars & momentum
        </p>
      </div>

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
