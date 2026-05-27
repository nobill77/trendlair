import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const TOPICS = [
  "ai",
  "machine-learning",
  "llm",
  "openai",
  "developer-tools",
  "open-source",
  "typescript",
  "nextjs",
];

function makeSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function insertItem(item) {
  await supabase
    .from("items")
    .upsert(item, { onConflict: "external_id" });
  console.log(`Upserted: ${item.title}`);
}
}

async function fetchGitHub() {
  console.log("Fetching GitHub...");
  const headers = { "User-Agent": "trendlair" };
  if (process.env.GITHUB_TOKEN) headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;

  for (const topic of TOPICS) {
    const res = await fetch(`https://api.github.com/search/repositories?q=topic:${topic}&sort=stars&order=desc&per_page=30`, { headers });
    const data = await res.json();
    for (const repo of data.items || []) {
      await insertItem({
        title: repo.full_name,
        description: repo.description || "No description.",
        type: "repo",
        source: "github",
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
  await supabase.from("items").delete().eq("type", "article").eq("source", "hackernews");
  const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const ids = await res.json();
  for (const id of ids.slice(0, 30)) {
    const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const story = await storyRes.json();
    if (!story || !story.url || story.type !== "story") continue;
    await supabase.from("items").insert({
      title: story.title,
      description: `HackerNews · ${story.score} points · ${story.descendants || 0} comments`,
      type: "article",
      source: "hackernews",
      url: story.url,
      github_url: null,
      tags: ["hackernews", "trending"],
      trend_score: story.score,
      stars: story.score,
      slug: makeSlug(`hn-${story.id}`),
    });
    console.log(`Added article: ${story.title}`);
  }
}

async function fetchProductHunt() {
  console.log("Fetching Product Hunt...");
  if (!process.env.PRODUCT_HUNT_TOKEN) { console.log("No PH token"); return; }
  await supabase.from("items").delete().eq("type", "tool").eq("source", "product_hunt");
  const query = `{ posts(first: 20, order: VOTES) { edges { node { id name tagline url votesCount topics { edges { node { name } } } } } } }`;
  const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: { "Authorization": `Bearer ${process.env.PRODUCT_HUNT_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  for (const edge of data.data?.posts?.edges || []) {
    const post = edge.node;
    const tags = post.topics?.edges?.map(e => e.node.name.toLowerCase()) || [];
    await insertItem({
      await insertItem({
        external_id: `gh_${repo.id}`,
        title: repo.full_name,
      type: "tool",
      source: "product_hunt",
      url: post.url,
      github_url: null,
      tags: ["producthunt", ...tags].slice(0, 8),
      trend_score: post.votesCount,
      stars: post.votesCount,
      slug: makeSlug(`ph-${post.id}`),
    });
    console.log(`Added tool: ${post.name}`);
  }
}

async function run() {
  console.log("Starting fetch...");
  await fetchGitHub();
  await fetchHackerNews();
  await fetchProductHunt();
  console.log("Done!");
}

run().catch(console.error);
