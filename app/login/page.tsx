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

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ width: "48px", height: "48px", background: "var(--accent)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "24px", fontWeight: 700, color: "#000" }}>D</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>
            {isSignUp ? "Join Discovery Engine" : "Sign in to your account"}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "12px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "14px", outline: "none", fontFamily: "var(--font-mono)" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "12px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", fontSize: "14px", outline: "none", fontFamily: "var(--font-mono)" }}
          />

          {message && (
            <p style={{ fontSize: "13px", color: message.includes("Check") ? "var(--accent)" : "var(--accent2)", textAlign: "center" }}>
              {message}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ padding: "12px", background: "var(--accent)", color: "#000", borderRadius: "8px", fontWeight: 700, fontSize: "13px", border: "none", cursor: "pointer", fontFamily: "var(--font-mono)" }}
          >
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </button>

          <p style={{ textAlign: "center", fontSize: "13px", color: "var(--muted)" }}>
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "13px" }}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
