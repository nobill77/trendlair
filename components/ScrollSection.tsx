"use client";

import { useRef } from "react";
import type { Item } from "@/lib/supabase";
import ItemCard from "./ItemCard";

const btnStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  border: "1px solid #c8ff00",
  background: "rgba(200,255,0,0.08)",
  color: "#c8ff00",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
  transition: "background 200ms ease",
};

export default function ScrollSection({ title, items }: { title: string; items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (ref.current) ref.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  if (!items || items.length === 0) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
          {title}
        </h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => scroll("left")}  style={btnStyle} aria-label="Scroll left">←</button>
          <button onClick={() => scroll("right")} style={btnStyle} aria-label="Scroll right">→</button>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <div
          ref={ref}
          style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "4px", paddingRight: "2rem", scrollbarWidth: "none" }}
        >
          {items.map((item: Item, i: number) => (
            <div key={item.id} style={{ minWidth: "285px", maxWidth: "285px", flexShrink: 0 }}>
              <ItemCard item={item} index={i} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, bottom: "4px", width: "100px", background: "linear-gradient(to right, transparent, #0a0a0f)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}
