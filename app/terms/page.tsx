import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Trendlair",
  description: "Terms governing your use of Trendlair.",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: "2.5rem" }}>
    <h2 style={{
      fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700,
      color: "var(--text)", marginBottom: "1rem", letterSpacing: "-0.02em",
    }}>{title}</h2>
    <div style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.8 }}>{children}</div>
  </div>
);

export default function TermsPage() {
  return (
    <main style={{ minHeight: "100vh", paddingTop: "80px", paddingBottom: "6rem", position: "relative" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 2rem", animation: "fadeUp 0.6s ease forwards" }}>

        <div style={{ marginBottom: "3rem" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.75rem" }}>
            Legal
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1,
            marginBottom: "1rem",
          }}>Terms of Service</h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            Last updated: May 28, 2025
          </p>
        </div>

        <div style={{ height: "1px", background: "var(--border)", marginBottom: "3rem" }} />

        <Section title="Acceptance of Terms">
          <p>By accessing or using Trendlair at trendlair.com, you agree to be bound by these Terms of Service. If you do not agree, do not use the service. We may update these terms at any time; continued use constitutes acceptance.</p>
        </Section>

        <Section title="Description of Service">
          <p>Trendlair is a discovery platform that aggregates and curates trending technology content from public sources including GitHub, Product Hunt, HackerNews, and Reddit. We provide search, filtering, and bookmarking tools to help you navigate this content.</p>
        </Section>

        <Section title="Accounts">
          <p style={{ marginBottom: "1rem" }}>You may use most of Trendlair without an account. Creating an account lets you save bookmarks. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account.</p>
          <p>You must be at least 13 years old to create an account. You must provide accurate information when registering.</p>
        </Section>

        <Section title="Acceptable Use">
          <p style={{ marginBottom: "0.75rem" }}>You agree not to:</p>
          <ul style={{ paddingLeft: "1.25rem", listStyleType: "disc" }}>
            <li style={{ marginBottom: "0.5rem" }}>Use the service for any unlawful purpose</li>
            <li style={{ marginBottom: "0.5rem" }}>Attempt to gain unauthorized access to any part of the service or its infrastructure</li>
            <li style={{ marginBottom: "0.5rem" }}>Scrape, crawl, or systematically download content without prior written consent</li>
            <li style={{ marginBottom: "0.5rem" }}>Transmit any viruses, malware, or other harmful code</li>
            <li>Interfere with or disrupt the service or its servers</li>
          </ul>
        </Section>

        <Section title="Intellectual Property">
          <p>The Trendlair name, logo, and original content are owned by Trendlair. Aggregated third-party content (repo titles, descriptions, links) belongs to their respective owners. We display it under fair use for informational purposes.</p>
        </Section>

        <Section title="Third-Party Content">
          <p>Trendlair links to and displays content from external sites. We do not endorse, control, or take responsibility for third-party content. Your interactions with those sites are governed by their own terms and policies.</p>
        </Section>

        <Section title="Disclaimers">
          <p>Trendlair is provided &quot;as is&quot; without warranties of any kind, express or implied. We do not warrant that the service will be uninterrupted, error-free, or that content is accurate or complete.</p>
        </Section>

        <Section title="Limitation of Liability">
          <p>To the maximum extent permitted by law, Trendlair and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.</p>
        </Section>

        <Section title="Termination">
          <p>We reserve the right to suspend or terminate your account at our discretion if you violate these terms. You may delete your account at any time by contacting us.</p>
        </Section>

        <Section title="Governing Law">
          <p>These terms are governed by applicable law. Any disputes shall be resolved through good-faith negotiation first, then binding arbitration if unresolved.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about these terms? Email us at <a href="mailto:hossammonazaa@gmail.com" style={{ color: "var(--accent)", textDecoration: "none" }}>hossammonazaa@gmail.com</a></p>
        </Section>

        <div style={{ height: "1px", background: "var(--border)", marginTop: "1rem", marginBottom: "2rem" }} />

        <div style={{ display: "flex", gap: "1.5rem", fontSize: "12px" }}>
          <Link href="/privacy" style={{ color: "var(--muted)", textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/about" style={{ color: "var(--muted)", textDecoration: "none" }}>About</Link>
          <Link href="/contact" style={{ color: "var(--muted)", textDecoration: "none" }}>Contact</Link>
        </div>
      </div>
    </main>
  );
}
