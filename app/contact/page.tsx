import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Trendlair team.",
};

const channels = [
  {
    icon: "✉",
    title: "Email",
    desc: "For general questions, feedback, or partnership inquiries.",
    action: "hello@trendlair.com",
    href: "mailto:hello@trendlair.com",
  },
  {
    icon: "🐛",
    title: "Bug Reports",
    desc: "Found something broken? Let us know so we can fix it.",
    action: "hello@trendlair.com",
    href: "mailto:hello@trendlair.com?subject=Bug Report",
  },
  {
    icon: "💡",
    title: "Feature Requests",
    desc: "Have an idea that would make Trendlair better?",
    action: "hello@trendlair.com",
    href: "mailto:hello@trendlair.com?subject=Feature Request",
  },
  {
    icon: "🔒",
    title: "Privacy & Data",
    desc: "Requests about your personal data, account deletion, or data access.",
    action: "hello@trendlair.com",
    href: "mailto:hello@trendlair.com?subject=Privacy Request",
  },
];

export default function ContactPage() {
  return (
    <main style={{ minHeight: "100vh", paddingTop: "80px", paddingBottom: "6rem", position: "relative" }}>
      <div style={{ position: "fixed", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,255,0,0.04) 0%, transparent 70%)", top: "25%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 2rem", animation: "fadeUp 0.6s ease forwards" }}>

        {/* Header */}
        <div style={{ marginBottom: "3.5rem", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", border: "1px solid rgba(200,255,0,0.3)", borderRadius: "100px", marginBottom: "1.5rem", background: "rgba(200,255,0,0.05)" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", animation: "pulse-glow 2s infinite" }} />
            <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: "var(--accent)" }}>WE READ EVERY MESSAGE</span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 0.95,
            marginBottom: "1.5rem",
          }}>
            Get in<br /><span style={{ color: "var(--accent)" }}>Touch</span>
          </h1>
          <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.8, maxWidth: "480px", margin: "0 auto" }}>
            We&apos;re a small team and genuinely value every piece of feedback. Whether it&apos;s a bug, an idea, or just a hello — reach out.
          </p>
        </div>

        <div style={{ height: "1px", background: "var(--border)", marginBottom: "3.5rem" }} />

        {/* Contact channels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", marginBottom: "3.5rem" }}>
          {channels.map(({ icon, title, desc, action, href }) => (
            <a key={title} href={href} className="contact-card">
              <div style={{ fontSize: "24px", marginBottom: "0.75rem" }}>{icon}</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>{title}</div>
              <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1rem" }}>{desc}</div>
              <div style={{ fontSize: "12px", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>{action} →</div>
            </a>
          ))}
        </div>

        {/* Response time */}
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem 2rem", background: "var(--surface)", display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3.5rem" }}>
          <div style={{ fontSize: "28px" }}>⏱</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)", marginBottom: "4px" }}>Response Time</div>
            <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>
              We aim to respond within 48 hours. For urgent issues, include &quot;Urgent&quot; in your subject line.
            </div>
          </div>
        </div>

        <div style={{ height: "1px", background: "var(--border)", marginBottom: "2rem" }} />

        <div style={{ display: "flex", gap: "1.5rem", fontSize: "12px" }}>
          <Link href="/privacy" style={{ color: "var(--muted)", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: "var(--muted)", textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/about" style={{ color: "var(--muted)", textDecoration: "none" }}>About</Link>
        </div>
      </div>
    </main>
  );
}
