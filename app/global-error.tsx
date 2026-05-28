"use client";
import Link from "next/link";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: "#0f1117", color: "#eeeef0", fontFamily: "monospace", margin: 0 }}>
        <main style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center",
        }}>
          <div style={{ fontSize: "80px", fontWeight: 800, color: "#c8ff00", opacity: 0.1, lineHeight: 1, marginBottom: "1.5rem" }}>500</div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem", letterSpacing: "-0.03em" }}>
            Critical error
          </h1>
          <p style={{ color: "rgba(220,220,230,0.5)", fontSize: "14px", marginBottom: "2.5rem", maxWidth: "360px", lineHeight: 1.7 }}>
            Something went seriously wrong. Try refreshing, or go back to the home page.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{
                padding: "12px 28px", background: "#c8ff00", color: "#000",
                border: "none", borderRadius: "8px", fontWeight: 700,
                fontSize: "13px", cursor: "pointer", letterSpacing: "0.05em",
              }}
            >
              Try Again
            </button>
            <a href="/" style={{
              padding: "12px 28px", border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(220,220,230,0.5)", borderRadius: "8px", fontSize: "13px",
              textDecoration: "none", letterSpacing: "0.05em",
            }}>
              Go Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
