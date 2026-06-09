"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/radar", label: "📡 Radar" },
  { href: "/workflows", label: "Workflows" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) { setBookmarkCount(0); return; }
    supabase
      .from("bookmarks")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => setBookmarkCount(count || 0));
  }, [user]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const linkStyle = (active: boolean) => ({
    textDecoration: "none", fontSize: "12px",
    letterSpacing: "0.08em", textTransform: "uppercase" as const,
    color: active ? "var(--accent)" : "var(--muted)",
    transition: "color 0.2s",
  });

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
        background: "rgba(8,8,8,0.85)",
        padding: "0 2rem", height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "28px", height: "28px", background: "var(--accent)",
              borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#000", fontSize: "14px", fontWeight: 700 }}>T</span>
            </div>
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "16px", color: "var(--text)", letterSpacing: "-0.02em",
            }}>Trendlair</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} style={linkStyle(pathname === href)}>{label}</Link>
          ))}

          {user && (
            <Link href="/bookmarks" style={{
              ...linkStyle(pathname === "/bookmarks"),
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              Bookmarks
              {bookmarkCount > 0 && (
                <span style={{
                  background: "var(--accent)", color: "#000",
                  borderRadius: "999px", fontSize: "10px",
                  fontWeight: 700, padding: "1px 6px",
                  fontFamily: "var(--font-mono)",
                }}>{bookmarkCount}</span>
              )}
            </Link>
          )}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                {user.email?.split("@")[0]}
              </span>
              <button onClick={handleSignOut} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "6px", color: "var(--muted)", fontSize: "11px",
                padding: "4px 10px", cursor: "pointer", fontFamily: "var(--font-mono)",
              }}>Logout</button>
            </div>
          ) : (
            <Link href="/login" style={{
              background: "var(--accent)", color: "#000", borderRadius: "6px",
              fontSize: "11px", padding: "5px 12px", fontWeight: 700,
              fontFamily: "var(--font-mono)", textDecoration: "none",
            }}>Login</Link>
          )}

          <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: "var(--accent)", boxShadow: "0 0 10px var(--accent)",
            animation: "pulse-glow 2s infinite",
          }} />
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            background: "none", border: "1px solid var(--border)", borderRadius: "6px",
            color: "var(--text)", padding: "6px 10px", cursor: "pointer", fontSize: "14px",
            display: "none",
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "56px", left: 0, right: 0, zIndex: 99,
          background: "rgba(8,8,8,0.97)", borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(20px)", padding: "1.5rem 2rem",
          display: "flex", flexDirection: "column", gap: "1.25rem",
          animation: "fadeUp 0.2s ease forwards",
        }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              ...linkStyle(pathname === href), fontSize: "14px",
            }}>{label}</Link>
          ))}
          {user && (
            <Link href="/bookmarks" style={{ ...linkStyle(pathname === "/bookmarks"), fontSize: "14px" }}>
              Bookmarks {bookmarkCount > 0 && `(${bookmarkCount})`}
            </Link>
          )}
          <div style={{ height: "1px", background: "var(--border)" }} />
          {user ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                {user.email?.split("@")[0]}
              </span>
              <button onClick={handleSignOut} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "6px", color: "var(--muted)", fontSize: "11px",
                padding: "6px 14px", cursor: "pointer", fontFamily: "var(--font-mono)",
              }}>Logout</button>
            </div>
          ) : (
            <Link href="/login" style={{
              background: "var(--accent)", color: "#000", borderRadius: "6px",
              fontSize: "12px", padding: "10px 16px", fontWeight: 700,
              fontFamily: "var(--font-mono)", textDecoration: "none", textAlign: "center",
            }}>Login</Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}

