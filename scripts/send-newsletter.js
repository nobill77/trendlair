const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function sendWeeklyNewsletter() {
  console.log('📧 Starting weekly newsletter...');

  // 1. جيب أعلى 10 ترندينج من آخر أسبوع
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select('title, description, url, source, trend_score, slug')
    .gte('created_at', oneWeekAgo.toISOString())
    .order('trend_score', { ascending: false })
    .limit(10);

  if (itemsError || !items || items.length === 0) {
    console.log('⚠️ No items found for this week');
    return;
  }

  // 2. جيب كل المشتركين
  const { data: subscribers, error: subError } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('unsubscribed', false);

  if (subError || !subscribers || subscribers.length === 0) {
    console.log('⚠️ No subscribers found');
    return;
  }

  console.log(`📬 Sending to ${subscribers.length} subscribers...`);

  // 3. ابن محتوى الإيميل
  const sourceLabels = {
    github: 'GitHub',
    product_hunt: 'Product Hunt',
    hackernews: 'HackerNews',
    reddit: 'Reddit'
  };

  const itemsList = items.map((item, i) => {
    const source = sourceLabels[item.source] || item.source;
    const stars = item.trend_score > 0 ? ` · ⭐ ${item.trend_score.toLocaleString()}` : '';
    return `${i + 1}. [${item.title}](https://trendlair.com/item/${item.slug})\n   ${source}${stars}\n   ${item.description ? item.description.slice(0, 100) + '...' : ''}`;
  }).join('\n\n');

  const weekStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const emailBody = `# 🔥 This Week on Trendlair — ${weekStr}\n\nHere are the top 10 trending tools, repos, and stories this week:\n\n${itemsList}\n\n---\n[Explore all trends →](https://trendlair.com/discover)\n\n*You're receiving this because you subscribed to Trendlair weekly trends.*\n*[Unsubscribe](https://trendlair.com)*`;

  // 4. بعت الإيميلات عبر Resend (لو متاح) أو سجل فقط
  const RESEND_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_KEY) {
    console.log('⚠️ RESEND_API_KEY not set — logging email content only');
    console.log('--- EMAIL PREVIEW ---');
    console.log(emailBody);
    console.log('--- END PREVIEW ---');
    console.log(`Would send to ${subscribers.length} subscribers`);
    return;
  }

  let sent = 0;
  for (const sub of subscribers) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_KEY}`
        },
        body: JSON.stringify({
          from: 'Trendlair <newsletter@trendlair.com>',
          to: sub.email,
          subject: `🔥 This Week on Trendlair — ${weekStr}`,
          text: emailBody
        })
      });
      if (res.ok) sent++;
    } catch (err) {
      console.error(`Failed to send to ${sub.email}:`, err.message);
    }
  }

  console.log(`✅ Newsletter sent to ${sent}/${subscribers.length} subscribers`);
}

sendWeeklyNewsletter().catch(console.error);
