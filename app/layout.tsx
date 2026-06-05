import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c8ff00",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://trendlair.com"),
  title: {
    default: "Trendlair — Find What's Trending in Tech",
    template: "%s — Trendlair",
  },
  description: "Discover trending AI repos, tools, and projects curated in real-time from GitHub, HackerNews, Product Hunt & Reddit.",
  keywords: [
    "trending tech tools",
    "github trending repositories",
    "AI tools 2025",
    "developer tools trending",
    "product hunt trending",
    "hackernews top posts",
    "open source trending",
    "new AI projects",
    "trending developer tools",
    "tech discovery",
    "startup tools trending",
    "best new github repos",
  ],
  openGraph: {
    type: "website",
    siteName: "Trendlair",
    title: "Trendlair — Find What's Trending in Tech",
    description: "Discover trending AI repos, tools, and projects curated in real-time.",
    url: "https://trendlair.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trendlair — Find What's Trending in Tech",
    description: "Discover trending AI repos, tools, and projects curated in real-time.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://trendlair.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

