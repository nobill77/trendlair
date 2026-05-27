import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const SUBREDDITS = [
  'MachineLearning',
  'artificial',
  'LocalLLaMA',
  'programming',
  'webdev',
  'opensource',
];

async function fetchSubredditRSS(subreddit) {
  const res = await fetch(
    `https://www.reddit.com/r/${subreddit}/top.rss?t=day&limit=15`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Trendlair/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      }
    }
  );

  if (!res.ok) {
    console.error(`Failed r/${subreddit}: ${res.status}`);
    return [];
  }

  const xml = await res.text();
  const items = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];
    const id = (entry.match(/<id>(.*?)<\/id>/) || [])[1] || '';
    const title = (entry.match(/<title[^>]*>(.*?)<\/title>/) || [])[1] || '';
    const link = (entry.match(/<link[^>]*href="([^"]*)"/) || [])[1] || '';
    const updated = (entry.match(/<updated>(.*?)<\/updated>/) || [])[1] || '';
    const content = (entry.match(/<content[^>]*>([\s\S]*?)<\/content>/) || [])[1] || '';

    const scoreMatch = content.match(/(\d+) points/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    if (!title || score < 10) continue;

    const postId = id.split('/').pop() || Date.now().toString();
    const cleanTitle = title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

    items.push({
      external_id: `reddit_${postId}`,
      slug: `reddit-${postId}-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50).replace(/-$/, '')}`,
      title: cleanTitle,
      description: `r/${subreddit} · ${score} upvotes`,
      url: link || `https://reddit.com/r/${subreddit}`,
      source: 'reddit',
      type: 'article',
      votes: score,
      trend_score: score,
      thumbnail: null,
      tags: [subreddit.toLowerCase(), 'reddit'],
      created_at: updated || new Date().toISOString(),
    });
  }

  return items;
}

async function fetchReddit() {
  let allPosts = [];

  for (const sub of SUBREDDITS) {
    const posts = await fetchSubredditRSS(sub);
    allPosts = allPosts.concat(posts);
    console.log(`✅ r/${sub}: ${posts.length} posts`);
    await new Promise(r => setTimeout(r, 2000));
  }

  if (allPosts.length === 0) {
    console.log('No posts fetched');
    return;
  }

  const { error } = await supabase
    .from('items')
    .upsert(allPosts, { onConflict: 'external_id' });

  if (error) {
    console.error('Supabase error:', error.message);
    process.exit(1);
  }

  console.log(`✅ Total: ${allPosts.length} Reddit posts inserted`);
}

fetchReddit();
