import { supabase } from "@/lib/supabase";
import type { Item } from "@/lib/supabase";
import ItemCard from "@/components/ItemCard";

interface DiscoverPageProps {
  searchParams: Promise<{ tag?: string; type?: string }>;
}

const ALL_TAGS = ["ai", "machine-learning", "llm", "developer-tools", "openai"];

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const params = await searchParams;
  const activeTag = params.tag;
  const activeType = params.type;

  let query = supabase
    .from("items")
    .select("*")
    .order("trend_score", { ascending: false })
    .limit(60);

  if (activeTag) {
    query = query.contains("tags", [activeTag]);
  }

  if (activeType) {
    query = query.eq("type", activeType);
  }

  const { data: items, error } = await query;

  if (error) {
    console.error("Supabase error:", error);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        paddingTop: "56px",
        padding: "calc(56px + 3rem) 2rem 4rem",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* Page header */}
      <div
        style={{
          marginBottom: "3rem",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "2rem",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.5rem",
              fontWeight: 700,
            }}
          >
            / Discover
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "var(--text)",
              lineHeight: 1,
            }}
          >
            Trending Now
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "0.75rem" }}>
            {items?.length ?? 0} items · Sorted by stars & momentum
          </p>
        </div>

        {/* Filter tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <a
            href="/discover"
            style={{
              padding: "6px 16px",
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              border: `1px solid ${!activeTag ? "var(--accent)" : "var(--border)"}`,
              color: !activeTag ? "var(--accent)" : "var(--muted)",
              borderRadius: "100px",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            All
          </a>
          {ALL_TAGS.map((tag) => (
            <a
              key={tag}
              href={`/discover?tag=${tag}`}
              style={{
                padding: "6px 16px",
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: `1px solid ${activeTag === tag ? "var(--accent)" : "var(--border)"}`,
                color: activeTag === tag ? "var(--accent)" : "var(--muted)",
                borderRadius: "100px",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              {tag}
            </a>
          ))}
        </div>
      </div>

      {/* Items grid */}
      {!items || items.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {items.map((item: Item, i: number) => (
            <ItemCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "6rem 2rem",
        border: "1px dashed var(--border)",
        borderRadius: "16px",
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "1rem" }}>🛸</div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "24px",
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: "0.75rem",
        }}
      >
        No items yet
      </h2>
      <p style={{ color: "var(--muted)", fontSize: "14px", maxWidth: "400px", margin: "0 auto" }}>
        Run the data fetcher to populate your Discovery Engine.
        <br />
        <code
          style={{
            display: "inline-block",
            marginTop: "1rem",
            padding: "8px 16px",
            background: "var(--surface2)",
            borderRadius: "6px",
            fontSize: "12px",
            color: "var(--accent)",
          }}
        >
          npm run fetch-data
        </code>
      </p>
    </div>
  );
}
