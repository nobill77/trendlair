const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const TOKEN = process.env.PRODUCT_HUNT_TOKEN;

async function fetchProductHunt() {
  const query = `
    {
      posts(first: 30, order: VOTES) {
        edges {
          node {
            id
            name
            tagline
            description
            url
            votesCount
            createdAt
            thumbnail { url }
            topics {
              edges { node { name } }
            }
          }
        }
      }
    }
  `;

  const res = await fetch('https://api.producthunt.com/v2/api/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  if (!json.data) {
    console.error('Product Hunt API error:', JSON.stringify(json));
    return;
  }

  const posts = json.data.posts.edges.map(({ node }) => ({
    external_id: `ph_${node.id}`,
    title: node.name,
    description: node.tagline,
    url: node.url,
    source: 'product_hunt',
    votes: node.votesCount,
    thumbnail: node.thumbnail?.url || null,
    tags: node.topics.edges.map(e => e.node.name),
    created_at: node.createdAt,
  }));

  const { error } = await supabase
    .from('items')
    .upsert(posts, { onConflict: 'external_id' });

  if (error) {
    console.error('Supabase error:', error.message);
  } else {
    console.log(`✅ Inserted/updated ${posts.length} Product Hunt items`);
  }
}

fetchProductHunt();
