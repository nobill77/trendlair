"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import { useAuth } from "@/lib/auth-context";

export default function BookmarkButton({ itemId }: { itemId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_id", itemId)
      .maybeSingle()
      .then(({ data }) => setBookmarked(!!data));
  }, [user, itemId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push("/login"); return; }
    setLoading(true);
    if (bookmarked) {
      await supabase.from("bookmarks").delete()
        .eq("user_id", user.id).eq("item_id", itemId);
      setBookmarked(false);
    } else {
      await supabase.from("bookmarks")
        .insert({ user_id: user.id, item_id: itemId });
      setBookmarked(true);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={bookmarked ? "Remove bookmark" : "Save"}
      style={{
        background: bookmarked ? "var(--accent)" : "transparent",
        border: `1px solid ${bookmarked ? "var(--accent)" : "var(--border)"}`,
        borderRadius: "6px",
        color: bookmarked ? "#000" : "var(--muted)",
        padding: "4px 10px",
        cursor: "pointer",
        fontSize: "12px",
        transition: "all 0.2s",
        fontFamily: "var(--font-mono)",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      {bookmarked ? "🔖 Saved" : "🔖 Save"}
    </button>
  );
}
