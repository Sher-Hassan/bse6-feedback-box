import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import FeedbackItem from './FeedbackItem'

const CATEGORIES = ['All', 'General', 'Course Content', 'Teaching Quality', 'Facilities', 'Administration', 'Other']

function Plus({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default function AdminDashboard({ session }) {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('Pending')
  const [filterCategory, setFilterCategory] = useState('All')

  useEffect(() => {
    fetchFeedback()

    const channel = supabase
      .channel('feedback-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'feedback' }, (payload) => {
        setFeedback(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchFeedback() {
    setLoading(true)
    const { data, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false })
    setLoading(false)
    if (!error) setFeedback(data)
  }

  function handleUpdate(id, changes) {
    setFeedback(prev => prev.map(item => item.id === id ? { ...item, ...changes } : item))
  }
  function handleDelete(id) {
    setFeedback(prev => prev.filter(item => item.id !== id))
  }

  const pending = feedback.filter(f => !f.is_reviewed)
  const reviewed = feedback.filter(f => f.is_reviewed)

  const filtered = feedback.filter(item => {
    const statusOk =
      filterStatus === 'All' ||
      (filterStatus === 'Pending' && !item.is_reviewed) ||
      (filterStatus === 'Reviewed' && item.is_reviewed)
    const catOk = filterCategory === 'All' || item.category === filterCategory
    return statusOk && catOk
  })

  const email = session.user.email
  const initials = email.slice(0, 1).toUpperCase()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', minHeight: 'calc(100vh - 92px)' }}>

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div>
          <div className="eyebrow"><span className="dot" />&nbsp;Triage queue</div>
          <h2 className="display" style={{ fontSize: 44, marginTop: 14, letterSpacing: '-.04em' }}>
            The<br />inbox.
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="stat stat--orange">
            <div className="n">{pending.length}</div>
            <div className="l">Pending</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="stat" style={{ padding: '18px' }}>
              <div className="n" style={{ fontSize: 36 }}>{feedback.length}</div>
              <div className="l" style={{ marginTop: 8 }}>Total</div>
            </div>
            <div className="stat" style={{ padding: '18px' }}>
              <div className="n" style={{ fontSize: 36, color: 'var(--green)' }}>{reviewed.length}</div>
              <div className="l" style={{ marginTop: 8 }}>Done</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div className="user-chip">
            <div className="user-chip__avatar">{initials}</div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, overflow: 'hidden' }}>
              <span className="user-chip__name">{email.split('@')[0]}</span>
              <span className="user-chip__email" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</span>
            </div>
            <button
              className="user-chip__signout"
              onClick={() => supabase.auth.signOut()}
            >Sign out</button>
          </div>
        </div>
      </aside>

      {/* ── Feed ── */}
      <div style={{ padding: '44px 56px 44px 36px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Filters bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['All', 'Pending', 'Reviewed'].map(s => (
              <button
                key={s}
                className={`chip ${filterStatus === s ? 'on' : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s}{s === 'Pending' ? ` · ${pending.length}` : ''}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12.5, color: 'var(--ink-mute)' }}>Category</span>
            <select
              className="field"
              style={{ width: 180, height: 40, padding: '0 38px 0 14px', borderRadius: 999 }}
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <button className="btn btn--ghost btn--sm">
              <span className="arr"><Plus size={11} /></span>
              Export
            </button>
          </div>
        </div>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 22, letterSpacing: '-.02em', margin: 0 }}>
            {filtered.length} submission{filtered.length !== 1 ? 's' : ''}
          </h3>
          <span className="bignum">Live · realtime feed</span>
        </div>

        {/* Feed */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div className="spinner" style={{ borderTopColor: 'var(--orange)', borderColor: 'var(--cream-line)' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-mute)', fontSize: 15 }}>
            No feedback matches these filters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', flex: 1 }}>
            {filtered.map(item => (
              <FeedbackItem key={item.id} item={item} onUpdate={handleUpdate} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
