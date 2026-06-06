import Link from "next/link";
import EmailCapture from "@/components/EmailCapture";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Trendlair — Trending Tech Tools & Repos, Updated Daily",
  description: "Trendlair aggregates trending GitHub repos, Product Hunt tools, HackerNews stories, and Reddit discussions in one place. Updated every 6 hours.",
  keywords: ["trending tech tools", "github trending", "product hunt", "hackernews", "developer discovery"],
  alternates: { canonical: "https://trendlair.com/about/" },
};

const sources = [
  { icon: "⚫", name: "GitHub", desc: "Top repositories ranked by stars and recent momentum" },
  { icon: "🟠", name: "HackerNews", desc: "Best stories and discussions ranked by community points" },
  { icon: "🔴", name: "Product Hunt", desc: "Top tools and launches ranked by upvotes" },
  { icon: "🟤", name: "Reddit", desc: "Trending discussions from r/programming, r/MachineLearning, and more" },
];

export default function AboutPage() {
  return (
    <main style={{ minHeight: "100vh", paddingTop: "80px", paddingBottom: "6rem", position: "relative" }}>
      <div style={{ position: "fixed", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,255,0,0.04) 0%, transparent 70%)", top: "20%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 2rem", animation: "fadeUp 0.6s ease forwards" }}>

        {/* Header */}
        <div style={{ marginBottom: "3.5rem", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", border: "1px solid rgba(200,255,0,0.3)", borderRadius: "100px", marginBottom: "1.5rem", background: "rgba(200,255,0,0.05)" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} />
            <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: "var(--accent)" }}>ABOUT TRENDLAIR</span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 0.95,
            marginBottom: "1.5rem",
          }}>
            Built for curious<br /><span style={{ color: "var(--accent)" }}>technologists</span>
          </h1>
          <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.8, maxWidth: "560px", margin: "0 auto" }}>
            Trendlair is a real-time discovery engine that surfaces the most interesting repositories, tools, and discussions across the tech ecosystem — so you spend less time searching and more time building.
          </p>
        </div>

        <div style={{ height: "1px", background: "var(--border)", marginBottom: "3.5rem" }} />

        {/* Mission */}
        <div style={{ marginBottom: "3.5rem" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem" }}>Mission</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
            Cut through the noise
          </h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.8, marginBottom: "1rem" }}>
            The internet moves fast. Every day, hundreds of repos are published, thousands of articles written, and countless tools launched. Keeping up is a full-time job.
          </p>
          <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.8 }}>
            Trendlair aggregates signals from the most trusted tech communities and ranks them by momentum and engagement — so the things that actually matter float to the top. Free, no algorithm black box, no engagement bait.
          </p>
        </div>

        {/* Sources */}
        <div style={{ marginBottom: "3.5rem" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem" }}>Data Sources</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            Where the data comes from
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            {sources.map(({ icon, name, desc }) => (
              <div key={name} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem 1.5rem", background: "var(--surface)", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <span style={{ fontSize: "22px", marginTop: "1px" }}>{icon}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "4px", fontFamily: "var(--font-display)" }}>{name}</div>
                  <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: "3.5rem" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem" }}>How It Works</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            Simple by design
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { step: "01", title: "Collect", desc: "Automated scripts pull data daily from GitHub, HackerNews, Product Hunt, and Reddit." },
              { step: "02", title: "Score", desc: "Each item is assigned a trend score based on stars, votes, comments, and recency." },
              { step: "03", title: "Curate", desc: "The top items surface in your feed, filterable by source, tag, and intent." },
              { step: "04", title: "Bookmark", desc: "Create a free account to save items and revisit them anytime." },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ display: "flex", gap: "1.5rem", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem 1.5rem", background: "var(--surface)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent)", minWidth: "24px", marginTop: "2px" }}>{step}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "4px", fontFamily: "var(--font-display)" }}>{title}</div>
                  <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ border: "1px solid rgba(200,255,0,0.2)", borderRadius: "16px", padding: "2.5rem", background: "rgba(200,255,0,0.03)", textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
            Questions or feedback?
          </h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            We&apos;re a small team and we read every message.
          </p>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", background: "var(--accent)", color: "#000", borderRadius: "8px", fontWeight: 700, fontSize: "13px", letterSpacing: "0.05em", textDecoration: "none", textTransform: "uppercase" }}>
            Get in Touch →
          </Link>
        </div>

        <div style={{ height: "1px", background: "var(--border)", marginBottom: "2rem" }} />

        <div style={{ display: "flex", gap: "1.5rem", fontSize: "12px" }}>
          <Link href="/privacy" style={{ color: "var(--muted)", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: "var(--muted)", textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/contact" style={{ color: "var(--muted)", textDecoration: "none" }}>Contact</Link>
        </div>
      </div>
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 2rem 4rem" }}>
        <EmailCapture itemName="Trendlair Weekly" />
      </div>
    </main>
  );
}

