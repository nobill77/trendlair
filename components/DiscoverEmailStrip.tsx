'use client'
import { useState } from 'react'

export default function DiscoverEmailStrip() {
  const [val, setVal] = useState('')
  const [done, setDone] = useState(false)

  async function go() {
    if (!val.includes('@')) return
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: val, source: 'discover' })
      })
    } catch {}
    setDone(true)
  }

  if (done) return <p style={{ fontSize: '11px', color: 'var(--accent)', padding: '6px 0' }}>✅ You&apos;re in! Weekly trends coming your way.</p>

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '11px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>📬 Weekly trends — free:</span>
      <input
        type="email" value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && go()}
        placeholder="your@email.com"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '5px 10px', fontSize: '11px', color: 'var(--text)', outline: 'none', width: '180px' }}
      />
      <button onClick={go} style={{ background: 'var(--accent)', color: '#000', border: 'none', padding: '5px 12px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
        Subscribe →
      </button>
    </div>
  )
}
