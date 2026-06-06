'use client'
import { useState } from 'react'

export default function EmailStrip() {
  const [email, setEmail] = useState('')
  const [done, setDone]   = useState(false)

  async function submit() {
    if (!email.includes('@')) return
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '1433c373-657a-4855-9c7b-37403bb1f93c',
        email,
        subject: 'New subscriber — Trendlair Discover',
        from_name: 'Trendlair'
      })
    })
    setDone(true)
  }

  if (done) return (
    <div style={{ fontSize: '12px', color: 'var(--accent)', padding: '8px 0' }}>
      ✅ You're in! Weekly trends coming your way.
    </div>
  )

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 0', borderBottom: '1px solid var(--border)',
      marginBottom: '1rem', flexWrap: 'wrap'
    }}>
      <span style={{ fontSize: '11px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
        📬 Weekly trend alerts:
      </span>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        placeholder="your@email.com"
        style={{
          background: 'var(--bg)', border: '1px solid var(--border)',
          padding: '5px 10px', fontSize: '11px', color: 'var(--text)',
          outline: 'none', width: '180px'
        }}
      />
      <button onClick={submit} style={{
        background: 'var(--accent)', color: '#000', border: 'none',
        padding: '5px 12px', fontSize: '10px', fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer'
      }}>
        Subscribe →
      </button>
    </div>
  )
}
