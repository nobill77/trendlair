"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const [focused, setFocused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setValue(q);
    clearTimeout(timer.current ?? undefined);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) {
        params.set("q", q);
      } else {
        params.delete("q");
      }
      router.push(`/discover?${params.toString()}`);
    }, 300);
  };

  const clear = () => {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`/discover?${params.toString()}`);
  };

  return (
    <div style={{ position: "relative", maxWidth: "500px" }}>
      <input
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search titles, descriptions, tags..."
        style={{
          width: "100%",
          padding: `10px ${value ? "36px" : "16px"} 10px 40px`,
          background: "var(--surface)",
          border: `1px solid ${focused ? "var(--accent)" : "var(--border)"}`,
          borderRadius: "8px",
          color: "var(--text)",
          fontSize: "13px",
          outline: "none",
          fontFamily: "var(--font-mono)",
          transition: "border-color 0.2s ease",
          boxShadow: focused ? "0 0 0 3px rgba(200,255,0,0.08)" : "none",
        }}
      />
      <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: focused ? "var(--accent)" : "var(--muted)", transition: "color 0.2s ease" }}>
        🔍
      </span>
      {value && (
        <button
          onClick={clear}
          aria-label="Clear search"
          style={{
            position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", color: "var(--muted)", cursor: "pointer",
            fontSize: "14px", padding: "2px", lineHeight: 1,
            transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
        >
          ✕
        </button>
      )}
    </div>
  );
}
