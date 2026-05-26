import Link from "next/link";

export default function HomePage() {
  const features = [
    { icon: "⚡", title: "Real-Time Updates", desc: "GitHub repos and HackerNews articles updated daily automatically" },
    { icon: "🔖", title: "Save Bookmarks", desc: "Save your favorite repos and articles to revisit anytime" },
    { icon: "🔍", title: "Smart Search", desc: "Filter by type, topic, or search for anything instantly" },
    { icon: "📈", title: "Trend Score", desc: "Items ranked by stars, momentum and community engagement" },
  ];

  return (
    <main style={{ minHeight: "100vh", paddingTop: "56px", position: "relative", overflow: "hidden" }}>

      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
        backgroundSize: "60px 60px", opacity: 0.3, pointerEvents: "none",
      }} />

      {/* Glow */}
      <div style={{
        position: "fixed", width: "800px", height: "800px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,255,0,0.05) 0%, transparent 70%)",
        top: "30%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none",
      }} />

      {/* Hero */}
      <section style={{
        position: "relative", textAlign: "center", padding: "6rem 2rem 4rem",
        display: "flex", flexDirection: "column", alignItems: "center",
        animation: "fadeUp 0.8s ease forwards",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 14px", border: "1px solid rgba(200,255,0,0.3)",
          borderRadius: "100px", marginBottom: "2rem",
          background: "rgba(200,255,0,0.05)",
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: "var(--accent)" }}>
            LIVE · UPDATED DAILY
          </span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 6rem)",
          fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em",
          color: "var(--text)", marginBottom: "1.5rem",
        }}>
          Find What's<br />
          <span style={{ color: "var(--accent)" }}>Trending</span><br />
          in Tech
        </h1>

        <p style={{
          fontSize: "15px", color: "var(--muted)", lineHeight: 1.7,
          marginBottom: "2.5rem", maxWidth: "480px",
        }}>
          Discovery Engine curates the best AI repos, tools, and articles
          from GitHub and HackerNews — ranked by momentum and relevance.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/discover" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "14px 32px", background: "var(--accent)", color: "#000",
            borderRadius: "8px", fontWeight: 700, fontSize: "13px",
            letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase",
          }}>
            Start Discovering →
          </Link>
          <Link href="/login" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "14px 32px", border: "1px solid var(--border)",
            color: "var(--muted)", borderRadius: "8px", fontSize: "13px",
            letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase",
          }}>
            Create Account
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: "3rem", marginTop: "4rem", flexWrap: "wrap", justifyContent: "center",
          opacity: 0, animation: "fadeUp 0.8s 0.3s ease forwards",
        }}>
          {[
            { label: "Repos Tracked", value: "60+" },
            { label: "Updated", value: "Daily" },
            { label: "Topics", value: "AI · LLM · Dev" },
            { label: "Free", value: "100%" },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)" }}>
                {value}
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px", letterSpacing: "0.05em" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border)", margin: "0 2rem" }} />

      {/* Features */}
      <section style={{
        position: "relative", maxWidth: "1100px", margin: "0 auto",
        padding: "5rem 2rem", opacity: 0, animation: "fadeUp 0.8s 0.5s ease forwards",
      }}>
        <p style={{
          textAlign: "center", fontSize: "11px", letterSpacing: "0.15em",
          textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem",
        }}>Why Discovery Engine</p>
        <h2 style={{
          textAlign: "center", fontFamily: "var(--font-display)",
          fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800,
          color: "var(--text)", marginBottom: "3rem", letterSpacing: "-0.02em",
        }}>
          Everything you need to stay ahead
        </h2>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem",
        }}>
          {features.map(({ icon, title, desc }, i) => (
            <div key={title} style={{
              border: "1px solid
