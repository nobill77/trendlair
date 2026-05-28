"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import { useAuth } from "@/lib/auth-context";
import { Item } from "@/lib/supabase";
import BookmarkButton from "@/components/BookmarkButton";
import SkeletonCard from "@/components/SkeletonCard";
import Link from "next/link";
import TagBadge from "@/components/TagBadge";

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    fetchBookmarks();
  }, [user, authLoading, router]);

  async function fetchBookmarks() {
    const { data: bookmarkData } = await supabase
      .from("bookmarks")
      .select("item_id");

    if (!bookmarkData || bookmarkData.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    const itemIds = bookmarkData.map((b: { item_id: string }) => b.item_id);
    const { data: itemsData } = await supabase
      .from("items").select("*").in("id", itemIds);

    if (itemsData) setItems(itemsData);
    setLoading(false);
  }

  if (authLoading || loading) return (
    <main style={{ paddingTop: "80px", minHeight: "100vh", padding: "80px 2rem 4rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div className="skeleton" style={{ width: "180px", height: "28px", marginBottom: "0.5rem" }} />
          <div className="skeleton" style={{ width: "100px", height: "14px" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
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
            {items.map((item, i) => (
              <Link key={item.id} href={`/item/${item.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  border: "1px solid var(--border)", borderRadius: "12px",
                  padding: "1.5rem", height: "100%", display: "flex",
                  flexDirection: "column", gap: "12px", background: "var(--surface)",
                  transition: "border-color 0.2s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700 }}>
                      {item.type}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {item.trend_score > 0 && (
                        <span style={{ fontSize: "11px", color: "var(--muted)" }}>⭐ {item.trend_score.toLocaleString()}</span>
                      )}
                      <BookmarkButton itemId={item.id} onRemove={() => setItems(prev => prev.filter(x => x.id !== item.id))} />
                    </div>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, color: "var(--text)", lineHeight: 1.3 }}>
                    {item.title}
                  </h2>
                  <p style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.6, flex: 1,
                    display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {item.description || "No description available."}
                  </p>
                  {item.tags && item.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {item.tags.slice(0, 4).map((tag) => <TagBadge key={tag} tag={tag} />)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
