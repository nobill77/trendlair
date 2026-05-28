"use client";

import Link from "next/link";
import { useState } from "react";
import type { Item } from "@/lib/supabase";
import TagBadge from "./TagBadge";
import BookmarkButton from "./BookmarkButton";

const CARD_COLORS = ["card-color-0","card-color-1","card-color-2","card-color-3","card-color-4"];

const SOURCE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  github:       { icon: "⚫", label: "GitHub",       color: "#e6edf3" },
  hackernews:   { icon: "🟠", label: "HackerNews",   color: "#ff6600" },
  product_hunt: { icon: "🔴", label: "Product Hunt", color: "#da552f" },
  reddit:       { icon: "🟤", label: "Reddit",       color: "#ff4500" },
};

export default function ItemCard({ item, index = 0 }: { item: Item; index?: number }) {
  const colorClass = CARD_COLORS[index % CARD_COLORS.length];
  const source = SOURCE_CONFIG[item.source || "github"] || SOURCE_CONFIG["github"];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`${colorClass}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? "2px solid rgba(255,255,255,0.8)" : "1px solid #2a3040",
        borderRadius: "12px",
        padding: "1.5rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        opacity: 0,
        animation: `fadeUp 0.5s ease ${index * 0.04}s forwards`,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #141820 0%, #0f1117 60%, #111418 100%)",
        transition: "border-color 300ms ease, box-shadow 300ms ease",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
      }}
    >
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700 }}>{item.type}</span>
          <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "100px", border: `1px solid ${source.color}33`, color: source.color, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
            {source.icon} {source.label}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {item.trend_score > 0 && (
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>⭐ {item.trend_score.toLocaleString()}</span>
          )}
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
