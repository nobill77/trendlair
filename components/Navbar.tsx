"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/discover", label: "Discover" },
    ...(user ? [{ href: "/bookmarks", label: "Bookmarks" }] : []),
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      borderBottom: "1px solid var(--border)",
      backdropFilter: "blur(20px)",
      background: "rgba(8,8,8,0.85)",
      padding: "0 2rem", height: "56px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "28px", height: "28px", background: "var(--accent)",
            borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#000", fontSize: "14px", fontWeight: 700 }}>D</span>
          </div>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "16px", color: "var(--text)", letterSpacing: "-0.02em",
          }}>Discovery Engine</span>
        </div>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {navLinks.map(({ href, label }) => (
          <Link key={href} href={href} style={{
            textDecoration: "none", fontSize: "12px",
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: pathname === href ? "var(--accent)" : "var(--muted)",
          }}>
            {label}
          </Link>
        ))}

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
    </nav>
  );
}
