import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import FeedbackItem from './FeedbackItem'

const CATEGORIES = ['All', 'General', 'Course Content', 'Teaching Quality', 'Facilities', 'Administration', 'Other']
const STATUS_OPTIONS = ['All', 'Pending', 'Reviewed']

export default function AdminDashboard({ session }) {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    fetchFeedback()

    const channel = supabase
      .channel('feedback-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'feedback' },
        (payload) => {
          setFeedback(prev => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchFeedback() {
    setLoading(true)
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })

    setLoading(false)
    if (!error) setFeedback(data)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  function handleUpdate(id, changes) {
    setFeedback(prev => prev.map(item => item.id === id ? { ...item, ...changes } : item))
  }

  function handleDelete(id) {
    setFeedback(prev => prev.filter(item => item.id !== id))
  }

  const filtered = feedback.filter(item => {
    const categoryMatch = filterCategory === 'All' || item.category === filterCategory
    const statusMatch =
      filterStatus === 'All' ||
      (filterStatus === 'Reviewed' && item.is_reviewed) ||
      (filterStatus === 'Pending' && !item.is_reviewed)
    return categoryMatch && statusMatch
  })

  const pendingCount = feedback.filter(f => !f.is_reviewed).length
  const reviewedCount = feedback.filter(f => f.is_reviewed).length

  return (
    <div className="dashboard-view">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-user">{session.user.email}</p>
          </div>
          <button className="btn btn-ghost sign-out-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-number">{feedback.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card stat-pending">
            <span className="stat-number">{pendingCount}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card stat-reviewed">
            <span className="stat-number">{reviewedCount}</span>
            <span className="stat-label">Reviewed</span>
          </div>
        </div>

        <div className="filters-bar">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="form-select filter-select"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="form-select filter-select"
            >
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <span className="filter-count">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>No feedback matches the current filters.</p>
          </div>
        ) : (
          <div className="feedback-list">
            {filtered.map(item => (
              <FeedbackItem
                key={item.id}
                item={item}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
