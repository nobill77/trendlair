"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
        background: "rgba(8,8,8,0.85)",
        padding: "0 2rem",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              background: "var(--accent)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#000", fontSize: "14px", fontWeight: 700 }}>D</span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "16px",
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            Discovery Engine
          </span>
        </div>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {[
          { href: "/", label: "Home" },
          { href: "/discover", label: "Discover" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              textDecoration: "none",
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: pathname === href ? "var(--accent)" : "var(--muted)",
              transition: "color 0.2s",
            }}
          >
            {label}
          </Link>
        ))}

        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--accent)",
            boxShadow: "0 0 10px var(--accent)",
            animation: "pulse-glow 2s infinite",
          }}
        />
      </div>
    </nav>
  );
}
