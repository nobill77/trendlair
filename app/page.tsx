import Link from "next/link";
import { supabase } from "@/lib/supabase";

const features = [
  { icon: "⚡", title: "Real-Time Updates", desc: "GitHub, Product Hunt, HackerNews & Reddit — updated daily automatically" },
  { icon: "🔖", title: "Save Bookmarks", desc: "Save your favorite repos, tools and articles to revisit anytime" },
  { icon: "🔍", title: "Smart Search", desc: "Filter by intent, topic, or search for anything instantly" },
  { icon: "📈", title: "Trend Score", desc: "Items ranked by stars, votes, momentum and community engagement" },
];

const sources = [
  { icon: "⚫", name: "GitHub", desc: "Top repos by stars & momentum" },
  { icon: "🟠", name: "HackerNews", desc: "Best stories by points" },
  { icon: "🔴", name: "Product Hunt", desc: "Top tools by votes" },
  { icon: "🟤", name: "Reddit", desc: "Discussions from 6 subreddits" },
];

export default async function HomePage() {
  const { count } = await supabase
    .from("items")
    .select("id", { count: "exact", head: true });

  const itemCount = count ? `${count}+` : "200+";

  return (
    <main style={{ minHeight: "100vh", paddingTop: "56px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "60px 60px", opacity: 0.3, pointerEvents: "none" }} />
      <div style={{ position: "fixed", width: "800px", height: "800px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,255,0,0.05) 0%, transparent 70%)", top: "30%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />

      <section style={{ position: "relative", textAlign: "center", padding: "6rem 2rem 4rem", display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeUp 0.8s ease forwards" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", border: "1px solid rgba(200,255,0,0.3)", borderRadius: "100px", marginBottom: "2rem", background: "rgba(200,255,0,0.05)" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: "var(--accent)" }}>LIVE · UPDATED DAILY</span>
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: "1.5rem" }}>
          Find What&apos;s<br /><span style={{ color: "var(--accent)" }}>Trending</span><br />in Tech
        </h1>

        <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "480px" }}>
          Trendlair curates the best AI repos, tools, and articles from GitHub, Product Hunt, HackerNews & Reddit — ranked by momentum and relevance.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/discover" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", background: "var(--accent)", color: "#000", borderRadius: "8px", fontWeight: 700, fontSize: "13px", letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
            Start Discovering →
          </Link>
          <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", border: "1px solid var(--border)", color: "var(--muted)", borderRadius: "8px", fontSize: "13px", letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
            Create Account
          </Link>
        </div>

        <div style={{ display: "flex", gap: "3rem", marginTop: "4rem", flexWrap: "wrap", justifyContent: "center", opacity: 0, animation: "fadeUp 0.8s 0.3s ease forwards" }}>
          {[
            { label: "Items Tracked", value: itemCount },
            { label: "Sources", value: "4" },
            { label: "Updated", value: "Daily" },
            { label: "Free", value: "100%" },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text)" }}>{value}</div>
              <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: "1px", background: "var(--border)", margin: "0 2rem" }} />

      <section style={{ position: "relative", maxWidth: "1100px", margin: "0 auto", padding: "4rem 2rem", opacity: 0, animation: "fadeUp 0.8s 0.4s ease forwards" }}>
        <p style={{ textAlign: "center", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem" }}>Data Sources</p>
        <h2 style={{ textAlign: "center", fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "var(--text)", marginBottom: "2rem", letterSpacing: "-0.02em" }}>
          Curated from 4 sources
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {sources.map(({ icon, name, desc }) => (
            <div key={name} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem 1.5rem", background: "var(--surface)", display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "24px" }}>{icon}</span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "2px" }}>{name}</div>
                <div style={{ fontSize: "12px", color: "var(--muted)" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: "1px", background: "var(--border)", margin: "0 2rem" }} />

      <section style={{ position: "relative", maxWidth: "1100px", margin: "0 auto", padding: "5rem 2rem", opacity: 0, animation: "fadeUp 0.8s 0.5s ease forwards" }}>
        <p style={{ textAlign: "center", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem" }}>Why Trendlair</p>
        <h2 style={{ textAlign: "center", fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--text)", marginBottom: "3rem", letterSpacing: "-0.02em" }}>
          Everything you need to stay ahead
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {features.map(({ icon, title, desc }) => (
            <div key={title} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", background: "var(--surface)" }}>
              <div style={{ fontSize: "28px", marginBottom: "1rem" }}>{icon}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "var(--text)", marginBottom: "0.5rem" }}>{title}</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ position: "relative", textAlign: "center", padding: "4rem 2rem 6rem", opacity: 0, animation: "fadeUp 0.8s 0.7s ease forwards" }}>
        <div style={{ maxWidth: "500px", margin: "0 auto", border: "1px solid rgba(200,255,0,0.2)", borderRadius: "16px", padding: "3rem 2rem", background: "rgba(200,255,0,0.03)" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "1rem" }}>Ready to explore?</h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "2rem", lineHeight: 1.6 }}>Join and start bookmarking the best tech resources today.</p>
          <Link href="/discover" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 40px", background: "var(--accent)", color: "#000", borderRadius: "8px", fontWeight: 700, fontSize: "13px", letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
            Explore Now →
          </Link>
        </div>
      </section>
    </main>
  );
}
