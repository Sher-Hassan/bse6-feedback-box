import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Arrow } from '../App'

export default function AdminLogin({ onCancel }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) setError('Invalid credentials. Please try again.')
  }

  return (
    <div
      style={{
        padding: '72px 80px',
        display: 'grid',
        gridTemplateColumns: '1fr 480px',
        gap: 64,
        minHeight: 'calc(100vh - 92px)',
        alignItems: 'center',
      }}
    >
      {/* ── Left: pitch ── */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 500 }}>
        <div>
          <div className="eyebrow"><span className="dot" />&nbsp;Back-of-house · Staff only</div>
          <h1
            className="display"
            style={{ fontSize: 'clamp(52px, 7vw, 104px)', marginTop: 28 }}
          >
            Quiet<br />
            <span style={{ color: 'var(--orange)' }}>conversations</span><br />
            with a loud<br />
            community.
          </h1>
          <p style={{ marginTop: 28, fontSize: 17, lineHeight: 1.55, color: 'var(--ink-mute)', maxWidth: 460 }}>
            Sign in to triage the feedback queue. Submissions are
            decoupled from any identity by the time they reach you —
            what you see is what the box saw.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 48 }}>
          <a href="#" className="inline-cta" onClick={e => e.preventDefault()}>
            <span className="arr"><Arrow size={12} /></span>
            How triage works
          </a>
          <span className="bignum">N⁰ 002 / Admin gate</span>
        </div>
      </div>

      {/* ── Right: sign-in card ── */}
      <div>
        <div className="form-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="eyebrow"><span className="dot" />&nbsp;Admin Sign-in</div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 32, letterSpacing: '-.025em', marginTop: 10 }}>
                Hello again.
              </div>
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: 'var(--ink)', color: 'var(--orange)',
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="10" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div>
              <label className="field-label">Email</label>
              <input
                className="field"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@oelab.cc"
                required
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <input
                className="field"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-fade)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Admin actions are audited</span>
                <button type="button" style={{ background: 'none', border: 'none', color: 'var(--ink-mute)', cursor: 'pointer', fontSize: 12, padding: 0 }}>Forgot?</button>
              </div>
            </div>

            {error && <p style={{ color: 'var(--red)', fontSize: 13, margin: 0 }}>{error}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--ink-mute)' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M8 5v3.5M8 11v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                Admin actions are audited
              </span>
              <button className="btn" type="submit" disabled={loading}>
                <span className="arr"><Arrow size={14} /></span>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>

        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 13, color: 'var(--ink-mute)' }}>
          Not staff?{' '}
          <a
            href="#"
            style={{ color: 'var(--ink)', borderBottom: '1px solid var(--ink-mute)', paddingBottom: 1, textDecoration: 'none' }}
            onClick={e => { e.preventDefault(); onCancel() }}
          >Go back to the feedback box →</a>
        </div>
      </div>
    </div>
  )
}
