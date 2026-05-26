"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import { useAuth } from "@/lib/auth-context";
import { Item } from "@/lib/supabase";
import BookmarkButton from "@/components/BookmarkButton";
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

    const itemIds = bookmarkData.map((b: any) => b.item_id);
    const { data: itemsData } = await supabase
      .from("items").select("*").in("id", itemIds);

    if (itemsData) setItems(itemsData);
    setLoading(false);
  }

  if (authLoading || loading) return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p s
