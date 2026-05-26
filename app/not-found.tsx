import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "56px",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "120px",
          fontWeight: 700,
          color: "var(--accent)",
          lineHeight: 1,
          opacity: 0.2,
          marginBottom: "1rem",
        }}
      >
        404
      </div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          fontWeight: 800,
          color: "var(--text)",
          marginBottom: "1rem",
        }}
      >
        Item Not Found
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        This item doesn't exist or was removed.
      </p>
      <Link
        href="/discover"
        style={{
          padding: "12px 28px",
          background: "var(--accent)",
          color: "#000",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: 700,
          fontSize: "13px",
        }}
      >
        Back to Discover →
      </Link>
    </main>
  );
}
