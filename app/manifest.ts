import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Trendlair — Find What's Trending in Tech",
    short_name: "Trendlair",
    description: "Discover trending AI repos, tools, and projects curated in real-time from GitHub, HackerNews, Product Hunt & Reddit.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1117",
    theme_color: "#c8ff00",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
