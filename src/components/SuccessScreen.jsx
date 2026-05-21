import { Arrow } from '../App'

export default function SuccessScreen({ submission, onReset }) {
  const now = new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
  const id = 'fb_' + Math.random().toString(36).slice(2, 8)

  return (
    <div
      style={{
        padding: '72px 80px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 48,
        minHeight: 'calc(100vh - 92px)',
        alignItems: 'center',
      }}
    >
      {/* ── Left: confirmation copy ── */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 500 }}>
        <div>
          <div className="eyebrow">
            <span className="dot dot--green" />&nbsp;Received · Encrypted · Anonymous
          </div>

          <h1
            className="display"
            style={{ fontSize: 'clamp(52px, 7vw, 108px)', marginTop: 28, lineHeight: .92 }}
          >
            Sent into<br />
            the void.<br />
            <span style={{ color: 'var(--orange)' }}>Thank you.</span>
          </h1>

          <p style={{ marginTop: 28, fontSize: 17, lineHeight: 1.55, color: 'var(--ink-mute)', maxWidth: 440 }}>
            Your note is now in the queue alongside everyone else's. The team
            reviews submissions Mondays &amp; Thursdays — we read every single
            one, even the cranky ones.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 48 }}>
          <button className="btn" onClick={onReset}>
            <span className="arr"><Arrow size={14} /></span>
            Submit another
          </button>
          <button className="btn btn--ghost" onClick={onReset}>
            <span className="arr"><Arrow size={12} /></span>
            Back to home
          </button>
        </div>
      </div>

      {/* ── Right: big check + receipt ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="success-check-outer">
          <div className="success-check-inner">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="success-check-tag">ID · {id}</div>
        </div>

        <div className="receipt">
          <span>Submitted</span>  <span className="val">Today · {now}</span>
          <span>Category</span>   <span className="val">{submission?.category ?? 'General'}</span>
          <span>Length</span>     <span className="val">{submission?.length ?? 0} chars</span>
          <span>Identifier</span> <span className="val">— none —</span>
        </div>
      </div>
    </div>
  )
}
