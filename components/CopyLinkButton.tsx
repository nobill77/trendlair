"use client";
import { useState } from "react";

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      title="Copy link"
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "8px 14px", background: "var(--surface)",
        border: `1px solid ${copied ? "rgba(200,255,0,0.4)" : "var(--border)"}`,
        borderRadius: "8px", color: copied ? "var(--accent)" : "var(--muted)",
        fontSize: "11px", cursor: "pointer", fontFamily: "var(--font-mono)",
        letterSpacing: "0.05em", transition: "all 0.2s",
      }}
    >
      {copied ? "✓ Copied" : "⎘ Copy link"}
    </button>
  );
}
