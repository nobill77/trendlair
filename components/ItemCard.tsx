import Link from "next/link";
import type { Item } from "@/lib/supabase";
import TagBadge from "./TagBadge";
import BookmarkButton from "./BookmarkButton";

const CARD_COLORS = ["card-color-0","card-color-1","card-color-2","card-color-3","card-color-4"];

export default function ItemCard({ item, index = 0 }: { item: Item; index?: number }) {
  const colorClass = CARD_COLORS[index % CARD_COLORS.length];
  return (
    <div className={`card-hover ${colorClass}`} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", height: "100%", display: "flex", flexDirection: "column", gap: "12px", opacity: 0, animation: `fadeUp 0.5s ease ${index * 0.04}s forwards`, position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700 }}>{item.type}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {item.trend_score > 0 && <span style={{ fontSize: "11px", color: "var(--muted)" }}>⭐ {item.trend_score.toLocaleString()}</span>}
          <BookmarkButton itemId={item.id} />
        </div>
      </div>

      <Link href={item.url || "#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "var(--text)", lineHeight: 1.3, cursor: "pointer" }}>{item.title} ↗</h2>
      </Link>

      <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.6, flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {item.description || "No description available."}
      </p>

      {item.tags && item.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {item.tags.slice(0, 4).map((tag) => <TagBadge key={tag} tag={tag} />)}
          </div>
          <Link href={`/item/${item.slug}`} style={{ fontSize: "10px", color: "var(--muted)", textDecoration: "none", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Details →</Link>
        </div>
      )}
    </div>
  );
}
