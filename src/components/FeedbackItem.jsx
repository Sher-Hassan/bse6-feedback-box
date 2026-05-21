import { useState } from 'react'
import { supabase } from '../supabaseClient'

function Arrow({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8h9M9 4.5L12.5 8 9 11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function Check({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function Dot({ size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3.2" fill="currentColor" />
    </svg>
  )
}
function TrashIcon({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 4.5h10M6.5 4.5V3.2c0-.4.3-.7.7-.7h1.6c.4 0 .7.3.7.7v1.3M4.7 4.5l.5 7.6c.03.4.36.7.75.7h4.1c.4 0 .72-.3.75-.7l.5-7.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FeedbackItem({ item, onUpdate, onDelete }) {
  const [toggling, setToggling] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function toggleReviewed() {
    setToggling(true)
    const { error } = await supabase.from('feedback').update({ is_reviewed: !item.is_reviewed }).eq('id', item.id)
    setToggling(false)
    if (!error) onUpdate(item.id, { is_reviewed: !item.is_reviewed })
  }

  async function handleDelete() {
    if (!confirm('Delete this feedback permanently?')) return
    setDeleting(true)
    const { error } = await supabase.from('feedback').delete().eq('id', item.id)
    setDeleting(false)
    if (!error) onDelete(item.id)
  }

  const date = new Date(item.created_at).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })
  const shortId = `fb_${item.id.toString(36).slice(-6)}`

  return (
    <div className={`row ${item.is_reviewed ? 'row--reviewed' : ''}`}>
      <div className="row__head">
        <span className="badge badge--cat">{item.category}</span>
        {item.is_reviewed
          ? <span className="badge badge--reviewed"><Check size={11} /> Reviewed</span>
          : <span className="badge badge--pending"><span className="pip" /> Pending</span>
        }
        <span className="row__id">{shortId}</span>
      </div>
      <div className="row__meta" style={{ alignSelf: 'center', textAlign: 'right' }}>{date}</div>

      <div className="row__body">{item.message}</div>

      <div className="row__actions" style={{ alignSelf: 'end' }}>
        {item.is_reviewed ? (
          <button className="btn btn--ghost btn--sm" onClick={toggleReviewed} disabled={toggling}>
            <span className="arr"><Dot size={10} /></span>
            {toggling ? '…' : 'Mark pending'}
          </button>
        ) : (
          <button className="btn btn--orange btn--sm" onClick={toggleReviewed} disabled={toggling}>
            <span className="arr"><Check size={11} /></span>
            {toggling ? '…' : 'Mark reviewed'}
          </button>
        )}
        <button className="btn btn--ghost btn--sm" onClick={handleDelete} disabled={deleting} style={{ paddingLeft: 12 }}>
          <span className="arr"><TrashIcon size={11} /></span>
          {deleting ? '…' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
