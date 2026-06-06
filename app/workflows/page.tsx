import type { Metadata } from "next";
import Link from "next/link";
import EmailCapture from "@/components/EmailCapture";

export const metadata: Metadata = {
  title: "Trendlair Workflows — Automated AI Tool Pipelines",
  description: "Pre-built AI workflows that combine trending tools into automated pipelines. Save hours of research and setup. Coming soon.",
  alternates: { canonical: "https://trendlair.com/workflows/" },
};

const workflows = [
  {
    id: 1,
    name: "AI Content Research Pipeline",
    description: "Find trending AI tools → analyze their GitHub activity → generate a full content brief about what makes them popular.",
    steps: ["Discover trending AI repos", "Analyze star growth & momentum", "Extract key features & use cases", "Generate content brief"],
    tags: ["AI", "Content", "Research"],
    estimatedTime: "~2 minutes",
    replaces: "4+ hours of manual research",
    status: "coming_soon",
  },
  {
    id: 2,
    name: "Open Source Competitor Tracker",
    description: "Track competing open source projects — monitor their GitHub stars, HackerNews mentions, and Product Hunt launches automatically.",
    steps: ["Input your tool category", "Find top 10 competitors on GitHub", "Track weekly momentum changes", "Get weekly digest report"],
    tags: ["Open Source", "Analytics", "Monitoring"],
    estimatedTime: "~3 minutes",
    replaces: "Daily manual tracking",
    status: "coming_soon",
  },
  {
    id: 3,
    name: "Developer Tool Launch Radar",
    description: "Spot new dev tools before they go viral — cross-reference GitHub, Product Hunt, and HackerNews to find rising stars early.",
    steps: ["Scan last 7 days of launches", "Score by cross-platform momentum", "Filter by your tech stack", "Export shortlist with links"],
    tags: ["Tools", "Discovery", "Early Access"],
    estimatedTime: "~1 minute",
    replaces: "Checking 4 platforms daily",
    status: "coming_soon",
  },
  {
    id: 4,
    name: "AI Stack Builder",
    description: "Describe your project goal → get a curated stack of trending open-source tools that work together, ranked by community adoption.",
    steps: ["Describe your project in plain English", "Match against 200+ trending tools", "Check compatibility & license", "Get full stack recommendation"],
    tags: ["AI", "Stack", "Recommendations"],
    estimatedTime: "~2 minutes",
    replaces: "Hours of tool comparison",
    status: "coming_soon",
  },
  {
    id: 5,
    name: "Reddit Signal Extractor",
    description: "Find real developer pain points from Reddit discussions — extract problems, requested tools, and market gaps from r/programming and r/MachineLearning.",
    steps: ["Scan 6 tech subreddits", "Extract recurring pain points", "Match with existing solutions", "Identify market gaps"],
    tags: ["Reddit", "Market Research", "Insights"],
    estimatedTime: "~3 minutes",
    replaces: "Hours of Reddit scrolling",
    status: "coming_soon",
  },
  {
    id: 6,
    name: "Weekly Tech Briefing Generator",
    description: "Auto-generate a personalized weekly briefing of the most important tech trends based on your interests and tech stack.",
    steps: ["Select your interests & stack", "Aggregate top items from all sources", "Rank by relevance to your profile", "Generate formatted briefing"],
    tags: ["Weekly", "Briefing", "Personalized"],
    estimatedTime: "~1 minute",
    replaces: "2+ hours of news reading",
    status: "coming_soon",
  },
];

const TAG_COLORS: Record<string, string> = {
  "AI": "rgba(200,255,0,0.15)",
  "Content": "rgba(100,200,255,0.1)",
  "Research": "rgba(255,200,100,0.1)",
  "Open Source": "rgba(200,255,0,0.15)",
  "Analytics": "rgba(100,200,255,0.1)",
  "Monitoring": "rgba(255,150,100,0.1)",
  "Tools": "rgba(200,255,0,0.15)",
  "Discovery": "rgba(100,200,255,0.1)",
  "Early Access": "rgba(255,200,100,0.1)",
  "Stack": "rgba(200,255,0,0.15)",
  "Recommendations": "rgba(100,200,255,0.1)",
  "Reddit": "rgba(255,100,100,0.15)",
  "Market Research": "rgba(255,200,100,0.1)",
  "Insights": "rgba(100,200,255,0.1)",
  "Weekly": "rgba(200,255,0,0.15)",
  "Briefing": "rgba(100,200,255,0.1)",
  "Personalized": "rgba(255,200,100,0.1)",
};

export default function WorkflowsPage() {
  return (
    <main style={{ minHeight: "100vh", paddingTop: "56px", position: "relative" }}>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "60px 60px", opacity: 0.2, pointerEvents: "none" }} />

      {/* Hero */}
      <section style={{ position: "relative", padding: "5rem 2rem 3rem", textAlign: "center", maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 16px", border: "1px solid rgba(200,255,0,0.3)", borderRadius: "100px", marginBottom: "2rem", background: "rgba(200,255,0,0.05)" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.15em", color: "var(--accent)", textTransform: "uppercase" }}>Coming Soon</span>
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem,7vw,5rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: "1.5rem" }}>
          Trendlair<br /><span style={{ color: "var(--accent)" }}>Workflows</span>
        </h1>

        <p style={{ fontSize: "16px", color: "var(--muted)", lineHeight: 1.7, maxWidth: "600px", margin: "0 auto 2rem" }}>
          Pre-built pipelines that combine trending tools into automated workflows.
          Stop researching manually — let the workflow do it for you.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
          {["✓ No setup required", "✓ Results in minutes", "✓ Built from trending tools"].map(f => (
            <span key={f} style={{ fontSize: "12px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px" }}>{f}</span>
          ))}
        </div>
      </section>

      {/* Waitlist CTA */}
      <div style={{ maxWidth: "700px", margin: "0 auto 4rem", padding: "0 2rem" }}>
        <div style={{ border: "1px solid rgba(200,255,0,0.25)", background: "rgba(200,255,0,0.03)", padding: "2rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(200,255,0,0.6), transparent)" }} />
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "8px" }}>Early Access</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "var(--text)", marginBottom: "8px" }}>Be first when we launch</p>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "1.5rem" }}>Join the waitlist and get free access to the first 3 workflows on launch day.</p>
          <EmailCapture itemName="Trendlair Workflows Waitlist" />
        </div>
      </div>

      {/* Workflows Grid */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem 6rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--text)", marginBottom: "2rem", textAlign: "center" }}>
          Workflows in Development
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
          {workflows.map(wf => (
            <div key={wf.id} style={{ border: "1px solid var(--border)", background: "var(--surface)", padding: "1.75rem", position: "relative", overflow: "hidden", transition: "border-color 0.2s" }}>

              {/* Coming soon badge */}
              <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", border: "1px solid var(--border)", padding: "3px 8px" }}>
                Soon
              </div>

              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "19px", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem", paddingRight: "3rem", lineHeight: 1.2 }}>
                {wf.name}
              </h3>

              <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                {wf.description}
              </p>

              {/* Steps */}
              <div style={{ marginBottom: "1.25rem" }}>
                {wf.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "6px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent)", minWidth: "16px", marginTop: "1px" }}>{i + 1}.</span>
                    <span style={{ fontSize: "12px", color: "var(--dim)" }}>{step}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                {wf.tags.map(tag => (
                  <span key={tag} style={{ fontSize: "10px", fontWeight: 600, padding: "3px 8px", background: TAG_COLORS[tag] || "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--muted)", borderRadius: "4px" }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: "1.5rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                <div>
                  <p style={{ fontSize: "10px", color: "var(--dim)", marginBottom: "2px" }}>Runtime</p>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)" }}>{wf.estimatedTime}</p>
                </div>
                <div>
                  <p style={{ fontSize: "10px", color: "var(--dim)", marginBottom: "2px" }}>Replaces</p>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)" }}>{wf.replaces}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "1rem" }}>
            Have an idea for a workflow? We build what the community needs.
          </p>
          <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid rgba(200,255,0,0.3)", color: "var(--accent)", padding: "12px 28px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
            Suggest a Workflow →
          </Link>
        </div>
      </div>
    </main>
  );
}
