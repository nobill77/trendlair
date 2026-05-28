"use client";
import Link from "next/link";
import { useState } from "react";

interface TagBadgeProps {
  tag: string;
  clickable?: boolean;
}

export default function TagBadge({ tag, clickable = true }: TagBadgeProps) {
  const [hovered, setHovered] = useState(false);

  const style = {
    display: "inline-block",
    padding: "2px 10px",
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    border: `1px solid ${hovered && clickable ? "rgba(200,255,0,0.4)" : "var(--border)"}`,
    borderRadius: "4px",
    color: hovered && clickable ? "var(--accent)" : "var(--muted)",
    background: hovered && clickable ? "rgba(200,255,0,0.05)" : "transparent",
    textDecoration: "none",
    transition: "border-color 0.15s, color 0.15s, background 0.15s",
    cursor: clickable ? "pointer" : "default",
  };

  if (!clickable) return <span style={style}>{tag}</span>;

  return (
    <Link
      href={`/discover?tag=${tag}`}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {tag}
    </Link>
  );
}
