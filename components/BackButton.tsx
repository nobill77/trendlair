"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        padding: "12px 28px", border: "1px solid var(--border)",
        color: "var(--muted)", borderRadius: "8px", fontSize: "12px",
        letterSpacing: "0.08em", textTransform: "uppercase",
        background: "transparent", cursor: "pointer", fontFamily: "var(--font-mono)",
        transition: "border-color 0.2s, color 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,255,0,0.3)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
      }}
    >
      ← Back
    </button>
  );
}
