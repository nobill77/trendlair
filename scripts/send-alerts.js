const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const RESEND_KEY = process.env.RESEND_API_KEY;

function opportunityScore(item) {
  const ageHours = (Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60);
  const trendSignal    = Math.min(item.trend_score / 10, 100);
  const freshnessBonus = ageHours < 6 ? 35 : ageHours < 24 ? 20 : ageHours < 72 ? 8 : 0;
  const starsBonus     = item.stars && item.stars > 100 && item.stars < 5000 ? 20 : 0;
  const votesBonus     = item.votes && item.votes > 50  && item.votes < 500  ? 15 : 0;
  return Math.round(Math.min(trendSignal + freshnessBonus + starsBonus + votesBonus, 100));
}

async function sendAlerts() {
  console.log('📡 Starting trend alerts...');

  // 1. جيب الـ items الجديدة من آخر 7 ساعات
  const since7h = new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString();
  const { data: newItems } = await supabase
    .from('items')
    .select('*')
    .gte('created_at', since7h)
    .order('trend_score', { ascending: false })
    .limit(50);

  if (!newItems || newItems.length === 0) {
    console.log('⚠️ No new items in last 7 hours');
    return;
  }

  // 2. احسب opportunity score لكل item
  const scoredItems = newItems
    .map(item => ({ ...item, oScore: opportunityScore(item) }))
    .filter(item => item.oScore >= 60)
    .sort((a, b) => b.oScore - a.oScore);

  if (scoredItems.length === 0) {
    console.log('⚠️ No high-score items to alert about');
    return;
  }

  console.log(`🔥 Found ${scoredItems.length} high-signal items`);

  // 3. جيب كل المشتركين في التنبيهات
  const { data: alertSubscribers } = await supabase
    .from('trend_alerts')
    .select('email, tags, min_score')
    .eq('active', true);

  if (!alertSubscribers || alertSubscribers.length === 0) {
    console.log('⚠️ No alert subscribers');
    return;
  }

  console.log(`📬 Processing ${alertSubscribers.length} alert subscribers...`);

  // 4. لكل مشترك — فلتر الـ items اللي تهمه وابعتلو إيميل
  const SOURCE_LABELS = {
    github: 'GitHub', hackernews: 'HackerNews', product_hunt: 'Product Hunt', reddit: 'Reddit'
  };

  let sent = 0;
  for (const sub of alertSubscribers) {
    // فلتر بـ min_score
    const relevantItems = scoredItems.filter(item => {
      if (item.oScore < (sub.min_score || 70)) return false;
      // فلتر بـ tags
      if (!sub.tags || sub.tags.includes('all')) return true;
      const itemTags = item.tags || [];
      return sub.tags.some(tag => itemTags.includes(tag));
    });

    if (relevantItems.length === 0) continue;

    // ابن الإيميل
    const topItems = relevantItems.slice(0, 5);
    const scoreLabel = score => score >= 80 ? '🔥 Hot' : score >= 70 ? '⚡ Rising' : '📈 Signal';

    const itemsHtml = topItems.map(item => {
      const source = SOURCE_LABELS[item.source] || item.source || 'Trending';
      const desc   = item.description ? item.description.slice(0, 120) + '...' : '';
      return `
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:12px;">
          <div style="font-size:11px;font-weight:700;color:#6366f1;margin-bottom:4px;">
            ${scoreLabel(item.oScore)} — Score ${item.oScore} · ${source}
          </div>
          <a href="https://trendlair.com/item/${item.slug}"
             style="font-size:16px;font-weight:700;color:#111827;text-decoration:none;">
            ${item.title}
          </a>
          ${desc ? `<p style="font-size:13px;color:#6b7280;margin:6px 0 0;">${desc}</p>` : ''}
          ${item.stars ? `<p style="font-size:12px;color:#9ca3af;margin:4px 0 0;">⭐ ${item.stars.toLocaleString()} stars</p>` : ''}
        </div>
      `;
    }).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 20px;background:#fff;">
        <div style="text-align:center;margin-bottom:32px;">
          <a href="https://trendlair.com" style="text-decoration:none;">
            <span style="font-size:20px;font-weight:900;color:#111827;letter-spacing:-0.5px;">Trendlair</span>
          </a>
          <p style="font-size:12px;color:#6b7280;margin:4px 0 0;">Opportunity Radar Alert</p>
        </div>

        <h1 style="font-size:22px;font-weight:700;color:#111827;margin-bottom:8px;">
          📡 ${topItems.length} High-Signal ${topItems.length === 1 ? 'Item' : 'Items'} on Your Radar
        </h1>
        <p style="font-size:14px;color:#6b7280;margin-bottom:24px;line-height:1.6;">
          New items matching your interests have hit your threshold of <strong>${sub.min_score || 70}+</strong>.
        </p>

        ${itemsHtml}

        <div style="text-align:center;margin-top:32px;">
          <a href="https://trendlair.com/radar"
             style="background:#6366f1;color:white;padding:12px 32px;border-radius:6px;
                    text-decoration:none;font-weight:700;font-size:13px;display:inline-block;">
            View Full Radar →
          </a>
        </div>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
        <p style="font-size:11px;color:#9ca3af;text-align:center;line-height:1.6;">
          You are receiving this because you subscribed to Trendlair radar alerts.<br/>
          <a href="https://trendlair.com/alerts" style="color:#6366f1;">Manage alerts</a>
        </p>
      </body>
      </html>
    `;

    // بعت الإيميل عبر Resend
    if (RESEND_KEY) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + RESEND_KEY },
          body: JSON.stringify({
            from:    'Trendlair Radar <radar@trendlair.com>',
            to:      [sub.email],
            subject: `📡 ${topItems.length} new high-signal ${topItems.length === 1 ? 'item' : 'items'} on your radar`,
            html:    emailHtml,
          })
        });
        if (res.ok) {
          sent++;
          console.log(`  ✅ Alert sent to ${sub.email} (${topItems.length} items)`);
        } else {
          const err = await res.text();
          console.log(`  ❌ Failed ${sub.email}: ${err.slice(0, 100)}`);
        }
      } catch (e) {
        console.log(`  ❌ Error sending to ${sub.email}: ${e.message}`);
      }
    } else {
      console.log(`  [DRY RUN] Would send alert to ${sub.email} (${topItems.length} items)`);
      sent++;
    }

    // انتظر 200ms بين كل إيميل عشان ما تتحظرش
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n✅ Done! Sent ${sent} alerts`);
}

sendAlerts().catch(console.error);
