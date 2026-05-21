import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Arrow } from '../App'

const CATEGORIES = ['General', 'Course Content', 'Teaching Quality', 'Facilities', 'Administration', 'Other']

export default function FeedbackForm({ onSuccess }) {
  const [category, setCategory] = useState('Course Content')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim()) { setError('Please write your feedback before submitting.'); return }
    setLoading(true); setError('')

    const { error: dbError } = await supabase
      .from('feedback')
      .insert({ message: message.trim(), category })

    setLoading(false)
    if (dbError) { setError('Failed to submit. Please try again.'); return }

    onSuccess({ category, length: message.trim().length })
  }

  return (
    <div
      style={{
        padding: '56px 64px 72px',
        display: 'grid',
        gridTemplateColumns: '1.05fr .95fr',
        gap: 48,
        minHeight: 'calc(100vh - 92px)',
        alignItems: 'start',
      }}
    >
      {/* ── Left: hero copy ── */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 600, paddingTop: 8 }}>
        <div>
          <div className="eyebrow"><span className="dot" />&nbsp;Anonymous · Always</div>

          <h1
            className="display"
            style={{ fontSize: 'clamp(56px, 6.5vw, 96px)', marginTop: 28, maxWidth: 620 }}
          >
            There is a<br />
            Better Way<br />
            to speak up.
          </h1>

          <p style={{ marginTop: 28, fontSize: 16.5, lineHeight: 1.55, color: 'var(--ink-mute)', maxWidth: 380 }}>
            Lab.CC is the anonymous feedback box for the Open Education Lab.
            No accounts, no identifiers, no IP logging — just the signal you
            wish someone would hear.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginTop: 48 }}>
          <a href="#" className="inline-cta" onClick={e => e.preventDefault()}>
            <span className="arr"><Arrow size={12} /></span>
            How we stay anonymous
          </a>
          <span className="bignum">N⁰ 001 / Public form</span>
        </div>
      </div>

      {/* ── Right: feedback form card ── */}
      <div>
        <div className="form-card" style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="eyebrow"><span className="dot" />&nbsp;Drop your feedback</div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 28, letterSpacing: '-.025em', marginTop: 10 }}>
                One box. Zero names.
              </div>
            </div>
            <span className="badge badge--orange"><span className="pip" /> Live</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div>
              <label className="field-label">Category</label>
              <div className="chips">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`chip ${c === category ? 'on' : ''}`}
                    onClick={() => setCategory(c)}
                  >{c}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="field-label">Your feedback</label>
              <textarea
                className="field"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Be specific — concrete examples travel further."
                rows={4}
                maxLength={1000}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--ink-fade)' }}>
                <span>Tip: be specific — concrete examples travel further.</span>
                <span style={{ fontFamily: 'var(--mono)' }}>{message.length} / 1000</span>
              </div>
            </div>

            {error && <p style={{ color: 'var(--red)', fontSize: 13, margin: 0 }}>{error}</p>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--ink-mute)' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5l5.5 2v4.2c0 3.2-2.2 5.7-5.5 6.8-3.3-1.1-5.5-3.6-5.5-6.8V3.5L8 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                  <path d="M5.5 8l1.7 1.7L10.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Encrypted in transit · No IP stored
              </span>
              <button className="btn btn--orange" type="submit" disabled={loading}>
                <span className="arr"><Arrow size={14} /></span>
                {loading ? 'Submitting…' : 'Submit Anonymously'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
