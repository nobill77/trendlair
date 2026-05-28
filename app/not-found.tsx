import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main style={{
      minHeight: "100vh", paddingTop: "56px", position: "relative",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "2rem", textAlign: "center",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,255,0,0.04) 0%, transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }} />

      {/* Big 404 */}
      <div style={{
        fontFamily: "var(--font-display)", fontSize: "clamp(6rem, 20vw, 14rem)",
        fontWeight: 800, lineHeight: 1, letterSpacing: "-0.05em",
        color: "var(--accent)", opacity: 0.08, userSelect: "none",
        position: "absolute", pointerEvents: "none",
      }}>404</div>

      {/* Content */}
      <div style={{ position: "relative", animation: "fadeUp 0.6s ease forwards" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "5px 14px", border: "1px solid rgba(200,255,0,0.3)",
          borderRadius: "100px", marginBottom: "1.5rem",
          background: "rgba(200,255,0,0.05)",
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
            404 · NOT FOUND
          </span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)",
          lineHeight: 1, marginBottom: "1rem",
        }}>
          Lost in the feed
        </h1>

        <p style={{
          fontSize: "15px", color: "var(--muted)", lineHeight: 1.7,
          maxWidth: "380px", margin: "0 auto 2.5rem",
        }}>
          This page doesn&apos;t exist or was removed. Head back and keep discovering.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/discover" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "12px 28px", background: "var(--accent)", color: "#000",
            borderRadius: "8px", fontWeight: 700, fontSize: "13px",
            letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase",
          }}>
            Explore Discover →
          </Link>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "12px 28px", border: "1px solid var(--border)",
            color: "var(--muted)", borderRadius: "8px", fontSize: "13px",
            letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase",
          }}>
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
