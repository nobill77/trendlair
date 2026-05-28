import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Trendlair collects, uses, and protects your data.",
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

export default function PrivacyPage() {
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
          }}>Privacy Policy</h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            Last updated: May 28, 2025
          </p>
        </div>

        <div style={{ height: "1px", background: "var(--border)", marginBottom: "3rem" }} />

        <Section title="Overview">
          <p>Trendlair (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates trendlair.com. This policy explains what information we collect, how we use it, and your rights regarding it. By using Trendlair, you agree to the practices described here.</p>
        </Section>

        <Section title="Information We Collect">
          <p style={{ marginBottom: "1rem" }}><strong style={{ color: "var(--text)" }}>Account information.</strong> When you create an account, we collect your email address and any profile information you provide.</p>
          <p style={{ marginBottom: "1rem" }}><strong style={{ color: "var(--text)" }}>Usage data.</strong> We collect information about how you interact with Trendlair — pages visited, items bookmarked, searches performed — to improve the service.</p>
          <p><strong style={{ color: "var(--text)" }}>Cookies &amp; local storage.</strong> We use cookies and browser storage to keep you signed in and remember your preferences.</p>
        </Section>

        <Section title="How We Use Your Information">
          <ul style={{ paddingLeft: "1.25rem", listStyleType: "disc" }}>
            <li style={{ marginBottom: "0.5rem" }}>Provide and maintain the Trendlair service</li>
            <li style={{ marginBottom: "0.5rem" }}>Personalize your discovery feed and bookmarks</li>
            <li style={{ marginBottom: "0.5rem" }}>Send occasional product updates (you can opt out at any time)</li>
            <li style={{ marginBottom: "0.5rem" }}>Diagnose technical issues and improve performance</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="Data Sharing">
          <p>We do not sell your personal data. We may share data with:</p>
          <ul style={{ paddingLeft: "1.25rem", listStyleType: "disc", marginTop: "0.75rem" }}>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "var(--text)" }}>Supabase</strong> — our backend database provider, for storing account and bookmark data.</li>
            <li style={{ marginBottom: "0.5rem" }}><strong style={{ color: "var(--text)" }}>Vercel</strong> — our hosting provider, for serving the application.</li>
            <li>Law enforcement or government bodies when required by law.</li>
          </ul>
        </Section>

        <Section title="Data Retention">
          <p>We retain your account data for as long as your account is active. You can delete your account at any time by contacting us, and we will remove your personal data within 30 days.</p>
        </Section>

        <Section title="Security">
          <p>We use industry-standard security practices including encrypted connections (HTTPS), hashed authentication tokens, and row-level security in our database. No method of transmission over the internet is 100% secure, but we take reasonable precautions.</p>
        </Section>

        <Section title="Your Rights">
          <p>Depending on your location, you may have rights to access, correct, export, or delete your personal data. To exercise these rights, contact us at the address below.</p>
        </Section>

        <Section title="Children">
          <p>Trendlair is not directed at children under 13. We do not knowingly collect personal data from children. If you believe a child has provided us data, contact us and we will delete it.</p>
        </Section>

        <Section title="Changes to This Policy">
          <p>We may update this policy from time to time. We will notify you of significant changes by updating the &quot;Last updated&quot; date and, where appropriate, by email.</p>
        </Section>

        <Section title="Contact Us">
          <p>Questions about this policy? Reach us at <a href="mailto:hossammonazaa@gmail.com" style={{ color: "var(--accent)", textDecoration: "none" }}>hossammonazaa@gmail.com</a></p>
        </Section>

        <div style={{ height: "1px", background: "var(--border)", marginTop: "1rem", marginBottom: "2rem" }} />

        <div style={{ display: "flex", gap: "1.5rem", fontSize: "12px" }}>
          <Link href="/terms" style={{ color: "var(--muted)", textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/about" style={{ color: "var(--muted)", textDecoration: "none" }}>About</Link>
          <Link href="/contact" style={{ color: "var(--muted)", textDecoration: "none" }}>Contact</Link>
        </div>
      </div>
    </main>
  );
}
