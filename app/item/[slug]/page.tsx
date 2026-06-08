import { supabase } from "@/lib/supabase";
import type { Item } from "@/lib/supabase";
import ItemCard from "@/components/ItemCard";
import TagBadge from "@/components/TagBadge";
import BackButton from "@/components/BackButton";
import CopyLinkButton from "@/components/CopyLinkButton";
import EmailCapture from "@/components/EmailCapture";
import Link from "next/link";
import { notFound } from "next/navigation";
import FounderCard from "@/components/FounderCard";
import type { Metadata } from "next";

interface ItemPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: item } = await supabase
    .from("items")
    .select("title, description, tags, source, trend_score")
    .eq("slug", slug)
    .single();

  if (!item) return {};

  // SEO-optimized title: keep under 60 chars, add context
  const rawTitle = item.title ?? slug;
  const seoTitle = rawTitle.length > 55
    ? rawTitle.slice(0, 52) + "..."
    : rawTitle;

  // SEO-optimized description: 120-160 chars
  const rawDesc = item.description ?? "";
  const sourceLabel = item.source === "product_hunt" ? "Product Hunt tool"
    : item.source === "hackernews" ? "HackerNews story"
    : item.source === "reddit" ? "Reddit discussion"
    : "GitHub repository";
  const stars = item.trend_score ? ` · ${item.trend_score.toLocaleString()} stars` : "";
  let seoDesc = rawDesc.length > 120
    ? rawDesc.slice(0, 117) + "..."
    : rawDesc.length < 60
    ? `${rawDesc} — Trending ${sourceLabel}${stars} on Trendlair.`.slice(0, 160)
    : rawDesc;
  if (seoDesc.length < 120) {
    seoDesc = `${seoDesc} Discover trending tech tools and repositories on Trendlair.`.slice(0, 160);
  }

  return {
    title: seoTitle,
    description: seoDesc,
    keywords: [...(item.tags ?? []), "trending", item.source ?? "tech", "open source"],
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: `https://trendlair.com/item/${slug}`,
      type: "article",
      siteName: "Trendlair",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDesc,
    },
    alternates: {
      canonical: `https://trendlair.com/item/${slug}`,
    },
  };
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { slug } = await params;

  // Get main item
  const { data: item } = await supabase
    .from("items")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!item) notFound();

  // Get related items: same tags OR same source, exclude self
  const tagFilter = item.tags?.length > 0 ? `tags.cs.{${item.tags[0]}}` : null;
  const sourceFilter = item.source ? `source.eq.${item.source}` : null;
  const orFilter = [tagFilter, sourceFilter].filter(Boolean).join(",");

  let relatedItems: Item[] = [];
  if (orFilter) {
    const { data: related } = await supabase
      .from("items")
      .select("*")
      .or(orFilter)
      .neq("id", item.id)
      .order("trend_score", { ascending: false })
      .limit(3);

    relatedItems = related || [];
  }

  // JSON-LD structured data for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": item.source === "product_hunt" ? "SoftwareApplication" : "TechArticle",
    "name": item.title,
    "description": item.description,
    "url": item.url,
    "datePublished": item.created_at,
    "publisher": {
      "@type": "Organization",
      "name": "Trendlair",
      "url": "https://trendlair.com"
    },
    ...(item.trend_score && { "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": Math.min(5, item.trend_score / 1000).toFixed(1),
      "reviewCount": item.trend_score
    }}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <main
      style={{
        minHeight: "100vh",
        paddingTop: "56px",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "calc(56px + 3rem) 2rem 5rem",
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          marginBottom: "2.5rem",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          color: "var(--muted)",
        }}
      >
        <Link href="/discover" style={{ color: "var(--muted)", textDecoration: "none" }}>
          Discover
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>{item.title}</span>
      </div>

      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          paddingBottom: "2.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              padding: "4px 12px",
              border: "1px solid rgba(200,255,0,0.3)",
              borderRadius: "4px",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontWeight: 700,
            }}
          >
            {item.type}
          </span>
          {item.trend_score > 0 && (
            <span style={{ fontSize: "13px", color: "var(--muted)" }}>
              ⭐ {item.trend_score.toLocaleString()} stars
            </span>
          )}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "var(--text)",
            lineHeight: 1.05,
            marginBottom: "1.5rem",
          }}
        >
          {item.title}
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "var(--muted)",
            lineHeight: 1.7,
            maxWidth: "700px",
            marginBottom: "2rem",
          }}
        >
          {item.description}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "2rem" }}>
            {item.tags.map((tag: string) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 28px",
                background: "var(--accent)",
                color: "#000",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "0.08em",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              {item.source === "hackernews" ? "View on HackerNews →"
              : item.source === "product_hunt" ? "View on Product Hunt →"
              : item.source === "reddit" ? "View on Reddit →"
              : "View on GitHub →"}
            </a>
          )}
          <BackButton />
          <CopyLinkButton />
        </div>
      </div>

      {/* Founder Funnel Card */}
      <FounderCard source={item.source || ""} />

      {/* Meta info */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "1px",
          background: "var(--border)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "2rem",
        }}
      >
        {[
          { label: "Type", value: item.type },
          { label: "Stars", value: item.trend_score?.toLocaleString() || "—" },
          {
            label: "Added",
            value: new Date(item.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          },
          { label: "Tags", value: item.tags?.length || 0 },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              padding: "1.5rem",
              background: "var(--surface)",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "8px",
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>


      {/* Mid-page Email Capture */}
      <div style={{ margin: "2rem 0" }}>
        <EmailCapture itemName={item.title} />
      </div>

            {/* Email Capture — Bottom */}
      <EmailCapture itemName={item.title} />

      {/* Related items */}
      {relatedItems.length > 0 && (
        <section>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ color: "var(--accent)" }}>↗</span>
            Related Items
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {relatedItems.map((related: Item, i: number) => (
              <ItemCard key={related.id} item={related} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
    </>
  );
}


