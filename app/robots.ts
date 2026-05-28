import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/bookmarks"],
    },
    sitemap: "https://trendlair.com/sitemap.xml",
  };
}
