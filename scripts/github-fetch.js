import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
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
  const data = await res.json();
  return data.items || [];
}

function makeSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function run() {
  console.log("Starting fetch...");
  for (const topic of TOPICS) {
    console.log(`Fetching: ${topic}`);
    const repos = await fetchRepos(topic);
    for (const repo of repos) {
      const slug = makeSlug(repo.name);
      const { data: existing } = await supabase
        .from("items").select("id").eq("slug", slug).single();
      if (existing) continue;
      await supabase.from("items").insert({
        title: repo.full_name,
        description: repo.description || "No description.",
        type: "repo",
        url: repo.html_url,
        github_url: repo.html_url,
        tags: [topic, ...(repo.topics || [])].slice(0, 8),
        trend_score: repo.stargazers_count,
        stars: repo.stargazers_count,
        slug: slug,
      });
      console.log(`Added: ${repo.name}`);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log("Done!");
}

run().catch(console.error);
