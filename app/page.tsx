import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        paddingTop: "56px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.4,
        }}
      />

      {/* Glow blob */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,255,0,0.06) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          pointerEvents: "none",
        }}
      />

      {/* Hero content */}
      <div
        style={{
          position: "relative",
          textAlign: "center",
          padding: "0 2rem",
          maxWidth: "700px",
          animation: "fadeUp 0.8s ease forwards",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            border: "1px solid rgba(200,255,0,0.3)",
            borderRadius: "100px",
            marginBottom: "2.5rem",
            background: "rgba(200,255,0,0.05)",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--accent)",
            }}
          />
          <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: "var(--accent)" }}>
            LIVE · UPDATED IN REAL-TIME
          </span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            color: "var(--text)",
            marginBottom: "2rem",
          }}
        >
          Find What's
          <br />
          <span style={{ color: "var(--accent)" }}>Trending</span>
          <br />
          in Tech
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "var(--muted)",
            lineHeight: 1.7,
            marginBottom: "3rem",
            maxWidth: "500px",
            margin: "0 auto 3rem",
          }}
        >
          Discovery Engine curates the best AI repos, tools, and projects
          from across the web — ranked by momentum and relevance.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link
            href="/discover"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              background: "var(--accent)",
              color: "#000",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.05em",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "opacity 0.2s",
            }}
          >
            Start Discovering →
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              border: "1px solid var(--border)",
              color: "var(--muted)",
              borderRadius: "8px",
              fontSize: "13px",
              letterSpacing: "0.05em",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "border-color 0.2s, color 0.2s",
            }}
          >
            View on GitHub
          </a>
        </div>
      </div>

      {/* Bottom stats */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          display: "flex",
          gap: "3rem",
          opacity: 0,
          animation: "fadeUp 0.8s 0.4s ease forwards",
        }}
      >
        {[
          { label: "Sources", value: "5+" },
          { label: "Updated", value: "Daily" },
          { label: "Topics", value: "AI · Tools · Dev" },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                color: "var(--text)",
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
