const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// نفس الـ formulas اللي في الـ fetch scripts
function normalizedScore(item) {
  const src = item.source || 'github';
  const raw = item.trend_score || 0;

  if (src === 'github') {
    // GitHub: stars-based — raw كان stargazers_count مباشرة
    // لو الـ score كبير جداً (> 1000) معناه لم يتعدل بعد
    if (raw > 1000) return Math.min(Math.round(raw / 10), 1000);
    return raw; // already normalized
  }
  if (src === 'hackernews') {
    if (raw > 1000) return Math.min(raw * 3, 1000);
    return raw;
  }
  if (src === 'product_hunt') {
    if (raw > 200) return Math.min(raw * 5, 1000);  // votes > 200 كانت raw
    return raw;
  }
  if (src === 'reddit') {
    if (raw > 250) return Math.min(raw * 4, 1000);
    return raw;
  }
  return raw;
}

async function normalizeExistingScores() {
  console.log('🔧 Normalizing existing trend scores...');

  const { data: items, error } = await supabase
    .from('items')
    .select('id, source, trend_score, stars, votes')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error || !items) {
    console.error('Error fetching items:', error);
    return;
  }

  console.log(`Found ${items.length} items to process`);

  let updated = 0;
  const BATCH = 50;

  for (let i = 0; i < items.length; i += BATCH) {
    const batch = items.slice(i, i + BATCH);
    const updates = batch
      .map(item => {
        const src = item.source || 'github';
        let newScore = item.trend_score;

        if (src === 'github' && item.trend_score > 1000) {
          newScore = Math.min(Math.round(item.trend_score / 10), 1000);
        } else if (src === 'hackernews' && item.trend_score > 1000) {
          newScore = Math.min(item.trend_score * 3, 1000);
        } else if (src === 'product_hunt' && item.trend_score > 200 && item.trend_score < 1000) {
          newScore = Math.min(item.trend_score * 5, 1000);
        } else if (src === 'reddit' && item.trend_score > 250 && item.trend_score < 1000) {
          newScore = Math.min(item.trend_score * 4, 1000);
        }

        return { id: item.id, trend_score: newScore };
      })
      .filter(u => u.trend_score !== batch.find(b => b.id === u.id)?.trend_score);

    if (updates.length > 0) {
      for (const update of updates) {
        await supabase
          .from('items')
          .update({ trend_score: update.trend_score })
          .eq('id', update.id);
      }
      updated += updates.length;
      console.log(`  Updated ${updated} items so far...`);
    }
  }

  console.log(`\n✅ Done! Normalized ${updated} items`);
}

normalizeExistingScores().catch(console.error);
