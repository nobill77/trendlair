// scripts/github-fetch.js
// Run: node scripts/github-fetch.js

import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Load .env.local
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TOPICS = ["ai", "machine-learning", "llm", "openai", "developer-tools"];

async function fetchRepos(topic) {
  const headers = { "User-Agent": "discovery-engine" };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/search/repositories?q=topic:${topic}&sort=stars&order=desc&per_page=20`,
    { headers }
  );

  if (!res.ok) {
    console.error(`GitHub API error: ${res.status} ${res.statusText}`);
    return [];
  }

  const data = await res.json();
  return data.items || [];
}

function makeSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function run() {
  console.log("🚀 Starting GitHub data fetch...\n");

  let totalInserted = 0;

  for (const topic of TOPICS) {
    console.log(`📦 Fetching topic: ${topic}`);
    const repos = await fetchRepos(topic);

    for (const repo of repos) {
      const slug = makeSlug(repo.name);

      // Check if already exists
      const { data: existing } = await supabase
        .from("items")
        .select("id")
        .eq("slug", slug)
        .single();

      if (existing) {
        console.log(`  ⏭️  Skipping (exists): ${repo.name}`);
        continue;
      }

      const { error } = await supabase.from("items").insert({
        title: repo.full_name,
        description: repo.description || "No description provided.",
        type: "repo",
        url: repo.html_url,
        github_url: repo.html_url,
        tags: [topic, ...(repo.topics || [])].slice(0, 8),
        trend_score: repo.stargazers_count,
        stars: repo.stargazers_count,
        slug: slug,
      });

      if (error) {
        console.error(`  ❌ Error inserting ${repo.name}:`, error.message);
      } else {
        console.log(`  ✅ Inserted: ${repo.name} (⭐ ${repo.stargazers_count})`);
        totalInserted++;
      }
    }

    // Small delay to respect rate limits
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\n✨ Done! Inserted ${totalInserted} new items.`);
}

run().catch(console.error);
