"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import { useAuth } from "@/lib/auth-context";
import { Item } from "@/lib/supabase";
import ItemCard from "@/components/ItemCard";

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }

    async function fetchBookmarks() {
      const { data: bookmarkData, error: bError } = await supabase
        .from("bookmarks")
        .select("item_id");

      if (bError) {
        setDebug("Bookmarks error: " + bError.message);
        setLoading(false);
        return;
      }

      if (!bookmarkData || bookmarkData.length === 0) {
        setDebug("");
        setLoading(false);
        return;
      }

      const itemIds = bookmarkData.map((b: any) => b.item_id);
      setDebug("Found " + bookmarkData.length + " bookmarks");

      const { data: itemsData, error: iError } = await supabase
        .from("items")
        .select("*")
        .in("id", itemIds);

      if (iError) {
        setDebug("Items error: " + iError.message);
      }

      if (itemsData) setItems(itemsData);
      setLoading(false);
    }

    fetchBookmarks();
  }, [user, authLoading, router]);

  if (authLoading || loading) return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--muted)", fontFamily: "var(--font-mono)" }}>Loading...</p>
    </main>
  );

  return (
    <main style={{ paddingTop: "80px", minHeight: "100vh", padding: "80px 2rem 4rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>
            🔖 My Bookmarks
          </h1>
          {debug && (
            <p style={{ color: "yellow", fontSize: "12px", fontFamily: "var(--font-mono)", background: "#333", padding: "8px", borderRadius: "4px" }}>
              DEBUG: {debug}
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
            <p style={{ fontSize: "48px", marginBottom: "1rem" }}>🔖</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--text)", marginBottom: "0.5rem" }}>No bookmarks yet</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {items.map((item, i) => <ItemCard key={item.id} item={item} index={i} />)}
          </div>
        )}
      </div>
    </main>
  );
}
