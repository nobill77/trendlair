"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main style={{
      minHeight: "100vh", paddingTop: "56px", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center",
    }}>
      <div style={{
        position: "fixed", width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,77,0,0.04) 0%, transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", animation: "fadeUp 0.6s ease forwards" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", border: "1px solid rgba(255,77,0,0.3)", borderRadius: "100px", marginBottom: "1.5rem", background: "rgba(255,77,0,0.05)" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent2)" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: "var(--accent2)", fontFamily: "var(--font-mono)" }}>SOMETHING WENT WRONG</span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1,
          marginBottom: "1rem",
        }}>Unexpected error</h1>

        <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto 2.5rem" }}>
          Something went wrong on our end. You can try again or head back to the home page.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={reset}
            style={{
              padding: "12px 28px", background: "var(--accent)", color: "#000",
              borderRadius: "8px", fontWeight: 700, fontSize: "13px",
              border: "none", cursor: "pointer", letterSpacing: "0.05em",
              textTransform: "uppercase", fontFamily: "var(--font-mono)",
            }}
          >
            Try Again
          </button>
          <Link href="/" style={{
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
