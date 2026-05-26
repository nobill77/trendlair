import Link from "next/link";
import type { Item } from "@/lib/supabase";
import TagBadge from "./TagBadge";

export default function ItemCard({ item, index = 0 }: { item: Item; index?: number }) {
  return (
    <Link
      href={`/item/${item.slug}`}
      style={{ textDecoration: "none" }}
    >
      <div
        className="card-hover"
        style={{
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "1.5rem",
          background: "var(--surface)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          animationDelay: `${index * 0.05}s`,
          opacity: 0,
          animation: `fadeUp 0.5s ease ${index * 0.04}s forwards`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Type pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
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
            <span
              style={{
                fontSize: "10px",
                color: "var(--muted)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ⭐ {item.trend_score.toLocaleString()}
            </span>
          )}
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--text)",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
          }}
        >
          {item.title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: "12px",
            color: "var(--muted)",
            lineHeight: 1.6,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description || "No description available."}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {item.tags.slice(0, 4).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, var(--accent), transparent)",
            opacity: 0,
            transition: "opacity 0.3s",
          }}
          className="card-accent-line"
        />
      </div>
    </Link>
  );
}
