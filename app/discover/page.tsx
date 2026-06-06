import { supabase } from "@/lib/supabase";
import type { Item } from "@/lib/supabase";
import type { Metadata } from "next";
import ItemCard from "@/components/ItemCard";
import ScrollSection from "@/components/ScrollSection";
import SearchInput from "@/components/SearchInput";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Discover Trending Tech — AI Tools, GitHub Repos & More",
  description: "Browse the hottest AI tools, GitHub repositories, and dev projects trending on GitHub, HackerNews, Product Hunt, and Reddit. Updated every 6 hours.",
  keywords: ["trending AI tools", "trending GitHub repos", "product hunt trending", "hackernews top", "new developer tools", "open source trending 2025"],
  openGraph: {
    title: "Discover Trending Tech — AI Tools, GitHub Repos & More",
    description: "The hottest AI tools, repos, and dev projects updated every 6 hours.",
    url: "https://trendlair.com/discover",
    type: "website",
  },
  alternates: { canonical: "https://trendlair.com/discover" },
};

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
  if (searchQuery) {
    const q = searchQuery.replace(/'/g, "''");
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,tags.cs.{${q}}`);
  }

  const isDefault = !activeType && !activeTag && !sortOrder && !searchQuery && !activeSource;
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [
    { data: items },
    { data: trending },
    { data: trendingHour },
    { data: justLaunched },
    { data: hiddenGems },
  ] = await Promise.all([
    query,
    isDefault ? supabase.from("items").select("*").order("trend_score", { ascending: false }).limit(5) : { data: [] as Item[] },
    isDefault ? supabase.from("items").select("*").gte("updated_at", since24h).order("trend_score", { ascending: false }).limit(10) : { data: [] as Item[] },
    isDefault ? supabase.from("items").select("*").order("created_at", { ascending: false }).limit(5) : { data: [] as Item[] },
    isDefault ? supabase.from("items").select("*").gt("stars", 500).neq("source", "github").order("stars", { ascending: false }).limit(5) : { data: [] as Item[] },
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

  return (
    <main style={{ minHeight: "100vh", padding: "calc(56px + 3rem) 2rem 4rem", maxWidth: "1400px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.5rem", fontWeight: 700 }}>
          / Discover
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1, marginBottom: "1.5rem" }}>
          Trending Now
        </h1>

        <div style={{ marginBottom: "1.5rem" }}>
          <Suspense fallback={<div style={{ width: "500px", maxWidth: "100%", height: "40px", background: "var(--surface)", border: "1px solid var(--border)" }} />}>
            <SearchInput />
          </Suspense>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", flexWrap: "wrap" }}>
          <Link href="/discover" style={linkStyle(isDefault)}>🔥 Trending</Link>
          <Link href="/discover?sort=new" style={linkStyle(sortOrder === "new")}>✨ New</Link>
          <Link href="/discover?tag=ai" style={linkStyle(activeTag === "ai")}>🤖 AI</Link>
          <Link href="/discover?type=tool" style={linkStyle(activeType === "tool")}>🚀 Tools</Link>
          <Link href="/discover?type=repo" style={linkStyle(activeType === "repo")}>📖 Open Source</Link>
          <Link href="/discover?type=article" style={linkStyle(activeType === "article")}>📰 Articles</Link>
          <Link href="/discover?source=reddit" style={linkStyle(params.source === "reddit")}>🟤 Reddit</Link>
        </div>

        {/* Email strip — inline */}
        <div id="email-strip" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 0", marginBottom: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", color: "var(--muted)", whiteSpace: "nowrap" }}>📬 Weekly trends free:</span>
          <input id="es-input" type="email" placeholder="your@email.com" style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "5px 10px", fontSize: "11px", color: "var(--text)", outline: "none", width: "180px" }} />
          <button
            style={{ background: "var(--accent)", color: "#000", border: "none", padding: "5px 12px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
            onClick={() => {
              const input = document.getElementById("es-input") as HTMLInputElement;
              if (!input?.value?.includes("@")) return;
              fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ access_key: "1433c373-657a-4855-9c7b-37403bb1f93c", email: input.value, subject: "Discover page subscriber", from_name: "Trendlair" }) });
              input.value = "✓ Subscribed!";
              (input as HTMLInputElement).disabled = true;
            }}
          >Subscribe →</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <p style={{ fontSize: "13px", color: "var(--muted)" }}>
            {items?.length ?? 0} items · {sortOrder === "new" ? "Sorted by date" : "Sorted by stars & momentum"}
          </p>
          {!isDefault && (
            <Link href="/discover" style={{ fontSize: "11px", color: "var(--accent)", textDecoration: "none", border: "1px solid rgba(200,255,0,0.3)", borderRadius: "100px", padding: "3px 10px" }}>
              ✕ Clear filters
            </Link>
          )}
        </div>
      </div>

      {/* Scroll sections */}
      {isDefault && (
        <div style={{ marginBottom: "3rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <ScrollSection title="⚡ Hot Right Now" items={trendingHour ?? []} />
          <ScrollSection title="🔥 Trending Now"  items={trending      ?? []} />
          <ScrollSection title="✨ Just Launched" items={justLaunched  ?? []} />
          <ScrollSection title="💎 Hidden Gems"   items={hiddenGems    ?? []} />
          <div style={{ height: "1px", background: "var(--border)" }} />
        </div>
      )}

      {/* Items grid */}
      {!items || items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "6rem 2rem", border: "1px dashed var(--border)" }}>
          <div style={{ fontSize: "48px", marginBottom: "1rem" }}>🔍</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem" }}>No results found</h2>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "1.5rem" }}>Try a different search or browse by category</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/discover" style={{ fontSize: "12px", color: "var(--accent)", textDecoration: "none", border: "1px solid rgba(200,255,0,0.3)", borderRadius: "100px", padding: "5px 14px" }}>🔥 Trending</Link>
            <Link href="/discover?tag=ai" style={{ fontSize: "12px", color: "var(--muted)", textDecoration: "none", border: "1px solid var(--border)", borderRadius: "100px", padding: "5px 14px" }}>🤖 AI</Link>
          </div>
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


