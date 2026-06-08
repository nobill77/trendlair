"use client";

import { useState } from "react";

interface FounderCardProps {
  source: string;
}

export default function FounderCard({ source }: FounderCardProps) {
  const [clicked, setClicked] = useState(false);

  if (source !== "product_hunt") return null;

  const handleClick = async () => {
    setClicked(true);
    // Track click in Supabase
    try {
      await fetch("/api/track-founder-click", { method: "POST" });
    } catch {}
    window.open("https://lexplair.com?ref=trendlair", "_blank");
  };

  return (
    <div
      style={{
        border: "1px solid rgba(200,255,0,0.3)",
        borderRadius: "12px",
        padding: "1.5rem 2rem",
        background: "linear-gradient(135deg, rgba(200,255,0,0.06) 0%, rgba(200,255,0,0.02) 100%)",
        margin: "2rem 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.5rem",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700 }}>
            🚀 Launching a company?
          </span>
        </div>
        <p style={{ fontSize: "14px", color: "var(--text)", fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.3 }}>
          Get your US LLC — fast, legal, and built for founders.
        </p>
        <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>
          Delaware · Wyoming · EIN · Bank Account · Everything you need.
        </p>
      </div>
      <button
        onClick={handleClick}
        style={{
          padding: "12px 28px",
          background: clicked ? "rgba(200,255,0,0.8)" : "var(--accent)",
          color: "#000",
          border: "none",
          borderRadius: "8px",
          fontWeight: 700,
          fontSize: "12px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-mono)",
          transition: "background 0.2s ease",
        }}
      >
        {clicked ? "Opening..." : "Get Started →"}
      </button>
    </div>
  );
}
