'use client'

import { useState } from 'react'

interface Props {
  itemName: string
}

export default function EmailCapture({ itemName }: Props) {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [shown, setShown]   = useState(true)

  if (!shown) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setStatus('loading')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'e5cdbf0a-9ef8-4902-9db3-472a66dcec87',
          email,
          item: itemName,
          subject: `New subscriber from ${itemName} — Trendlair`,
          from_name: 'Trendlair'
        })
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setTimeout(() => setShown(false), 3000)
      } else {
        setStatus('idle')
      }
    } catch {
      setStatus('idle')
    }
  }

  return (
    <div style={{
      margin: '3rem 0',
      border: '1px solid rgba(200,255,0,0.15)',
      borderRadius: '12px',
      background: 'var(--surface)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(200,255,0,0.6), transparent)',
      }} />

      {/* close button */}
      <button
        onClick={() => setShown(false)}
        style={{
          position: 'absolute', top: '14px', right: '16px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--muted)', fontSize: '18px', lineHeight: 1,
        }}
      >×</button>

      <div style={{ padding: '2rem 2rem 2rem' }}>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>✅</div>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: '18px',
              fontWeight: 700, color: 'var(--text)', marginBottom: '6px',
            }}>You&apos;re in!</p>
            <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
              We&apos;ll send you weekly tech trends & discoveries.
            </p>
          </div>
        ) : (
          <>
            <p style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em',
              textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '10px',
            }}>Weekly Tech Trends</p>

            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: '20px',
              fontWeight: 700, color: 'var(--text)', lineHeight: 1.2,
              marginBottom: '8px',
            }}>
              Get the hottest tools & projects, weekly
            </h3>

            <p style={{
              fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6,
              marginBottom: '1.5rem',
            }}>
              Join builders getting curated tech discoveries every week. No spam.
            </p>

            <form onSubmit={handleSubmit} style={{
              display: 'flex', gap: '10px', flexWrap: 'wrap',
            }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1, minWidth: '200px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  color: 'var(--text)',
                  outline: 'none',
                  fontFamily: 'var(--font-mono)',
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  background: 'var(--accent)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: status === 'loading' ? 0.6 : 1,
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'nowrap',
                }}
              >
                {status === 'loading' ? 'Sending...' : 'Get Trends →'}
              </button>
            </form>

            <p style={{
              fontSize: '10px', color: 'var(--muted)', marginTop: '10px', opacity: 0.6,
            }}>No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  )
}
