import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  return (
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
          <Link key={href} href={href} style={{
            fontSize: "12px", color: "var(--muted)", textDecoration: "none",
            letterSpacing: "0.05em",
          }}>
            {label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
