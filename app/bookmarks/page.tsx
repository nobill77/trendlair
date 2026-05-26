"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import { useAuth } from "@/lib/auth-context";
import { Item } from "@/lib/supabase";
import ItemCard from "@/components/ItemCard";

export default function BookmarksPage() {
  const { loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    async function fetchBookmarks() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        router.push("/login");
        return;
      }

      const { data: bookmarkData } = await supabase
        .from("bookmarks")
        .select("item_id")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (!bookmarkData || bookmarkData.length === 0) {
        setLoading(false);
        return;
      }

      const itemIds = bookmarkData.map((b: any) => b.item_id);

      const { data: itemsData } = await supabase
        .from("items")
        .select("*")
        .in("id", itemIds);

      if (itemsData) setItems(itemsData);
      setLoading(false);
    }

    fetchBookmarks();
  }, [authLoading, router]);

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
          <p style={{ color: "var(--muted)", fontSize: "13px", fontFamily: "var(--font-mono)" }}>
            {items.length} saved item{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
            <p style={{ fontSize: "48px", marginBottom: "1rem" }}>🔖</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--text)", marginBottom: "0.5rem" }}>
              No bookmarks yet
            </p>
            <p style={{ fontSize: "13px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
              Save repos and articles you love from the Discover page
            </p>
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
