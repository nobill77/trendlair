"use client";
import { useState } from "react";
import Link from "next/link";

const INTEREST_OPTIONS = [
  { id: "all",          icon: "🌐", label: "Everything",     desc: "All trending items" },
  { id: "ai",           icon: "🤖", label: "AI / ML",        desc: "Artificial intelligence tools" },
  { id: "devtools",     icon: "🛠️", label: "Dev Tools",      desc: "Tools for developers" },
  { id: "saas",         icon: "💻", label: "SaaS",           desc: "Software products" },
  { id: "open-source",  icon: "⚡", label: "Open Source",    desc: "High-momentum OSS repos" },
  { id: "productivity", icon: "📈", label: "Productivity",   desc: "Tools that save time" },
];

const SCORE_OPTIONS = [
  { value: 60, label: "Rising Fast",     desc: "Score 60+ — catching up" },
  { value: 70, label: "High Signal",     desc: "Score 70+ — recommended" },
  { value: 80, label: "Hot Only",        desc: "Score 80+ — only the best" },
];

export default function AlertsPage() {
  const [email,      setEmail]     = useState("");
  const [tags,       setTags]      = useState<string[]>(["ai"]);
  const [minScore,   setMinScore]  = useState(70);
  const [status,     setStatus]    = useState<"idle" | "loading" | "success" | "error">("idle");

  function toggleTag(id: string) {
    if (id === "all") {
      setTags(["all"]);
      return;
    }
    setTags(prev => {
      const without = prev.filter(t => t !== "all");
      if (without.includes(id)) {
        const next = without.filter(t => t !== id);
        return next.length === 0 ? ["all"] : next;
      }
      return [...without, id];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/alerts", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, tags, minScore }),
      });
      const data = await res.json();
      setStatus(data.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main style={{ minHeight: "100vh", paddingTop: "72px" }}>

      {/* Hero */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }} />
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "56px 20px 48px", textAlign: "center" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.3em",
            textTransform: "uppercase", color: "#6366f1", marginBottom: "16px" }}>
            Trend Alerts
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,5vw,3rem)",
            fontWeight: 700, color: "var(--white)", lineHeight: 1.2, marginBottom: "16px" }}>
            Get Notified When Something Hot Drops
          </h1>
          <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.7,
            maxWidth: "520px", margin: "0 auto 32px" }}>
            Choose your interests and minimum opportunity score. We will email you as soon as
            a high-signal tool or repo hits the radar — no noise, only signal.
          </p>
          <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: "⚡", text: "Real-time alerts" },
              { icon: "🎯", text: "You choose the threshold" },
              { icon: "🔕", text: "Unsubscribe anytime" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "6px",
                fontSize: "12px", color: "var(--dim)" }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 20px 80px" }}>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "60px 20px",
            border: "1px solid #6366f140", background: "rgba(99,102,241,0.05)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "24px",
              fontWeight: 700, color: "var(--white)", marginBottom: "8px" }}>
              You are on the radar!
            </h2>
            <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "24px" }}>
              We will email you when something matching your interests hits score {minScore}+.
            </p>
            <Link href="/radar" style={{ color: "#6366f1", fontSize: "13px", textDecoration: "none" }}>
              ← View Opportunity Radar
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase", color: "#6366f1",
                marginBottom: "10px" }}>
                Your Email Address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                style={{
                  width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
                  padding: "14px 16px", fontSize: "14px", color: "var(--white)",
                  outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Interests */}
            <div>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase", color: "#6366f1",
                marginBottom: "10px" }}>
                What are you interested in?
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {INTEREST_OPTIONS.map(opt => {
                  const selected = tags.includes(opt.id);
                  return (
                    <button key={opt.id} type="button" onClick={() => toggleTag(opt.id)}
                      style={{
                        textAlign: "left", padding: "14px 16px", cursor: "pointer",
                        border: selected ? "1px solid #6366f1" : "1px solid var(--border)",
                        background: selected ? "rgba(99,102,241,0.08)" : "var(--bg)",
                        transition: "all 0.15s",
                      }}>
                      <div style={{ fontSize: "18px", marginBottom: "4px" }}>{opt.icon}</div>
                      <div style={{ fontSize: "13px", fontWeight: 700,
                        color: selected ? "#a5b4fc" : "var(--white)" }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--dim)", marginTop: "2px" }}>
                        {opt.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Threshold */}
            <div>
              <label style={{ display: "block", fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase", color: "#6366f1",
                marginBottom: "10px" }}>
                Alert me when opportunity score reaches
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {SCORE_OPTIONS.map(opt => (
                  <button key={opt.value} type="button" onClick={() => setMinScore(opt.value)}
                    style={{
                      flex: 1, padding: "14px 10px", textAlign: "center", cursor: "pointer",
                      border: minScore === opt.value ? "1px solid #6366f1" : "1px solid var(--border)",
                      background: minScore === opt.value ? "rgba(99,102,241,0.08)" : "var(--bg)",
                      transition: "all 0.15s",
                    }}>
                    <div style={{ fontSize: "20px", fontWeight: 700,
                      color: minScore === opt.value ? "#a5b4fc" : "var(--white)" }}>
                      {opt.value}+
                    </div>
                    <div style={{ fontSize: "11px", fontWeight: 700,
                      color: minScore === opt.value ? "#a5b4fc" : "var(--muted)", marginTop: "2px" }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--dim)", marginTop: "2px" }}>
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={status === "loading" || !email}
              style={{
                padding: "16px", fontSize: "12px", fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase",
                background: email ? "#6366f1" : "var(--border)",
                color: email ? "white" : "var(--dim)",
                border: "none", cursor: email ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}>
              {status === "loading" ? "Setting up your alerts..." : "Activate Trend Alerts →"}
            </button>

            {status === "error" && (
              <p style={{ fontSize: "12px", color: "#f87171", textAlign: "center" }}>
                Something went wrong. Please try again.
              </p>
            )}

            <p style={{ fontSize: "11px", color: "var(--dim)", textAlign: "center" }}>
              Alerts are sent when new high-score items are discovered — usually every 6 hours.{" "}
              <Link href="/radar" style={{ color: "#6366f1", textDecoration: "none" }}>
                Preview the radar →
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
