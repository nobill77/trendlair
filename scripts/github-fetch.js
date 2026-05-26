import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const TOPICS = ["ai", "machine-learning", "llm", "openai", "developer-tools"];

function makeSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function insertItem(item) {
  const { data: existing } = await supabase
    .from("items").select("id").eq("slug", item.slug).single();
  if (existing) return;
  await supabase.from("items").insert(item);
  console.log(`Added: ${item.title}`);
}

async function fetchGitHub() {
  console.log("Fetching GitHub...");
  const headers = { "User-Agent": "discovery-engine" };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }
  for (const topic of TOPICS) {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=topic:${topic}&sort=stars&order=desc&per_page=20`,
      { headers }
    );
    const data = await res.json();
    for (const repo of data.items || []) {
      await insertItem({
        title: repo.full_name,
        description: repo.description || "No description.",
        type: "repo",
        url: repo.html_url,
        github_url: repo.html_url,
        tags: [topic, ...(repo.topics || [])].slice(0, 8),
        trend_score: repo.stargazers_count,
        stars: repo.stargazers_count,
        slug: makeSlug(repo.name),
      });
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
}

async function fetchHackerNews() {
  console.log("Fetching HackerNews...");

  await supabase.from("items").delete().eq("type", "article");
  console.log("Deleted old articles");

  const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const ids = await res.json();
  const top30 = ids.slice(0, 30);

  for (const id of top30) {
    const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const story = await storyRes.json();
    if (!story || !story.url || story.type !== "story") continue;

    const slug = makeSlug(`hn-${story.id}`);

    await supabase.from("items").insert({
      title: story.title,
      description: `HackerNews · ${story.score} points · ${story.descendants || 0} comments`,
      type: "article",
      url: story.url,
      github_url: null,
      tags: ["hackernews", "trending"],
      trend_score: story.score,
      stars: story.score,
      slug: slug,
    });

    console.log(`Added article: ${story.title}`);
  }
}

async function run() {
  console.log("Starting fetch...");
  await fetchGitHub();
  await fetchHackerNews();
  console.log("Done!");
}

run().catch(console.error);
