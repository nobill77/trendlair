"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit() {
    if (!email || !password) return;
    setLoading(true);
    setMessage("");
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage("Check your email to confirm your account!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else router.push("/discover");
    }
    setLoading(false);
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "400px", animation: "fadeUp 0.5s ease forwards" }}>

        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: "48px", height: "48px", background: "var(--accent)", borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem", fontSize: "22px", fontWeight: 800, color: "#000",
            fontFamily: "var(--font-display)",
          }}>T</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem", letterSpacing: "-0.03em" }}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>
            {isSignUp ? "Join Trendlair" : "Sign in to your Trendlair account"}
          </p>
        </div>

        <div style={{ border: "1px solid var(--border)", borderRadius: "16px", padding: "2rem", background: "var(--surface)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onKeyDown}
              style={{
                padding: "12px 16px", background: "var(--bg)",
                border: "1px solid var(--border)", borderRadius: "8px",
                color: "var(--text)", fontSize: "14px", outline: "none",
                fontFamily: "var(--font-mono)", transition: "border-color 0.2s",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKeyDown}
              style={{
                padding: "12px 16px", background: "var(--bg)",
                border: "1px solid var(--border)", borderRadius: "8px",
                color: "var(--text)", fontSize: "14px", outline: "none",
                fontFamily: "var(--font-mono)", transition: "border-color 0.2s",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />

            {message && (
              <p style={{
                fontSize: "13px",
                color: message.includes("Check") ? "var(--accent)" : "#ff6b6b",
                textAlign: "center", padding: "8px 12px",
                background: message.includes("Check") ? "rgba(200,255,0,0.06)" : "rgba(255,107,107,0.06)",
                borderRadius: "8px", border: `1px solid ${message.includes("Check") ? "rgba(200,255,0,0.2)" : "rgba(255,107,107,0.2)"}`,
              }}>
                {message}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !email || !password}
              style={{
                padding: "12px", background: "var(--accent)", color: "#000",
                borderRadius: "8px", fontWeight: 700, fontSize: "13px",
                border: "none", cursor: loading ? "wait" : "pointer",
                fontFamily: "var(--font-mono)", letterSpacing: "0.05em",
                opacity: !email || !password ? 0.6 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </button>

            <p style={{ textAlign: "center", fontSize: "13px", color: "var(--muted)" }}>
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setMessage(""); }}
                style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "13px" }}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
