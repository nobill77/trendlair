import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const TRENDLAIR_URL = (process.env.TRENDLAIR_SITE_URL || "https://trendlair.com").replace(/\/$/, "");

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

async function upsertItem(item) {
  const { error } = await supabase
    .from("items")
    .upsert(item, { onConflict: "external_id" });
  if (error) console.error(`Upsert error for ${item.title}:`, error.message);
  else console.log(`Upserted: ${item.title}`);
}

async function postReport(source, counts, errors = []) {
  try {
    const res = await fetch(TRENDLAIR_URL + "/api/brain/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.SUPABASE_SERVICE_KEY,
      },
      body: JSON.stringify({ source, ...counts, errors }),
    });
    if (res.ok) console.log(`📊 Report posted for ${source}`);
    else console.warn(`Report endpoint returned ${res.status} for ${source}`);
  } catch (e) {
    console.warn(`Could not post report for ${source}:`, e.message);
  }
}

async function fetchGitHub() {
  console.log("Fetching GitHub...");
  const headers = { "User-Agent": "trendlair" };
  if (process.env.GITHUB_TOKEN) headers["Authorization"] = "token " + process.env.GITHUB_TOKEN;

  let items_fetched = 0;
  const errors = [];

  for (const topic of TOPICS) {
    try {
      const res = await fetch(
        "https://api.github.com/search/repositories?q=topic:" + topic + "&sort=stars&order=desc&per_page=30",
        { headers }
      );
      const data = await res.json();
      for (const repo of data.items || []) {
        await upsertItem({
          external_id: "gh_" + repo.id,
          title: repo.full_name,
          description: repo.description || "No description.",
          type: "repo",
          source: "github",
          url: repo.html_url,
          github_url: repo.html_url,
          tags: [topic, ...(repo.topics || [])].slice(0, 8),
          trend_score: Math.min(Math.round(repo.stargazers_count / 10), 1000),
          stars: repo.stargazers_count,
          slug: makeSlug(repo.name),
        });
        items_fetched++;
      }
    } catch (e) {
      errors.push({ topic, error: e.message });
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  await postReport("github", { items_fetched, items_new: items_fetched, items_updated: 0 }, errors);
}

async function fetchHackerNews() {
  console.log("Fetching HackerNews...");
  let items_fetched = 0;
  const errors = [];

  try {
    const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const ids = await res.json();
    for (const id of ids.slice(0, 30)) {
      try {
        const storyRes = await fetch("https://hacker-news.firebaseio.com/v0/item/" + id + ".json");
        const story = await storyRes.json();
        if (!story || !story.url || story.type !== "story") continue;
        // Use upsert to avoid duplicates (previously used delete + insert which caused data gaps)
        const { error } = await supabase.from("items").upsert(
          {
            external_id: "hn_" + story.id,
            title: story.title,
            description: "HackerNews · " + story.score + " points · " + (story.descendants || 0) + " comments",
            type: "article",
            source: "hackernews",
            url: story.url,
            github_url: null,
            tags: ["hackernews", "trending"],
            trend_score: Math.min(story.score * 3, 1000),
            stars: story.score,
            slug: makeSlug("hn-" + story.id),
          },
          { onConflict: "external_id" }
        );
        if (error) errors.push({ id: story.id, error: error.message });
        else {
          console.log("Added article: " + story.title);
          items_fetched++;
        }
      } catch (e) {
        errors.push({ id, error: e.message });
      }
    }
  } catch (e) {
    errors.push({ error: e.message });
  }

  await postReport("hackernews", { items_fetched, items_new: items_fetched, items_updated: 0 }, errors);
}

async function fetchProductHunt() {
  console.log("Fetching Product Hunt...");
  if (!process.env.PRODUCT_HUNT_TOKEN) { console.log("No PH token"); return; }

  let items_fetched = 0;
  const errors = [];

  try {
    const query = "{ posts(first: 20, order: VOTES) { edges { node { id name tagline url votesCount topics { edges { node { name } } } } } } }";
    const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.PRODUCT_HUNT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    for (const edge of data.data?.posts?.edges || []) {
      const post = edge.node;
      const tags = post.topics?.edges?.map((e) => e.node.name.toLowerCase()) || [];
      await upsertItem({
        external_id: "ph_" + post.id,
        title: post.name,
        description: post.tagline,
        type: "tool",
        source: "product_hunt",
        url: post.url,
        github_url: null,
        tags: ["producthunt", ...tags].slice(0, 8),
        trend_score: post.votesCount,
        stars: post.votesCount,
        slug: makeSlug("ph-" + post.id),
      });
      items_fetched++;
    }
  } catch (e) {
    errors.push({ error: e.message });
  }

  await postReport("product_hunt", { items_fetched, items_new: items_fetched, items_updated: 0 }, errors);
}

async function run() {
  console.log("Starting fetch...");
  await fetchGitHub();
  await fetchHackerNews();
  await fetchProductHunt();
  console.log("Done!");
}

run().catch(console.error);
