import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  metadataBase: new URL("https://trendlair.com"),
  title: {
    default: "Trendlair — Find What's Trending in Tech",
    template: "%s — Trendlair",
  },
  description: "Discover trending AI repos, tools, and projects curated in real-time from GitHub, HackerNews, Product Hunt & Reddit.",
  keywords: ["trending tech", "github trending", "ai tools", "developer tools", "hackernews", "product hunt"],
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
