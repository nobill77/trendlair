"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        position: "fixed", bottom: "2rem", right: "2rem", zIndex: 50,
        width: "40px", height: "40px", borderRadius: "50%",
        background: "var(--surface)", border: "1px solid var(--border)",
        color: "var(--accent)", fontSize: "16px", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 12px rgba(200,255,0,0.2)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.4)";
      }}
    >
      ↑
    </button>
  );
}

export default function Footer() {
  return (
    <>
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <span style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
          © {new Date().getFullYear()} Trendlair
        </span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{ fontSize: "12px", color: "var(--muted)", textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"}
            >
              {label}
            </Link>
          ))}
        </div>
      </footer>
      <BackToTop />
    </>
  );
}
