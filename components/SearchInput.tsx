"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setValue(q);
    clearTimeout(timer.current);
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

  return (
    <div style={{ position: "relative", maxWidth: "500px" }}>
      <input
        value={value}
        onChange={handleChange}
        placeholder="Search titles, descriptions, tags..."
        style={{
          width: "100%",
          padding: "10px 16px 10px 40px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          color: "var(--text)",
          fontSize: "13px",
          outline: "none",
          fontFamily: "var(--font-mono)",
        }}
      />
      <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>
        🔍
      </span>
    </div>
  );
}
