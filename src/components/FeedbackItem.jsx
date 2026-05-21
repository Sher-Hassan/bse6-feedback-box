import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function FeedbackItem({ item, onUpdate, onDelete }) {
  const [toggling, setToggling] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function toggleReviewed() {
    setToggling(true)
    const { error } = await supabase
      .from('feedback')
      .update({ is_reviewed: !item.is_reviewed })
      .eq('id', item.id)
    setToggling(false)
    if (!error) onUpdate(item.id, { is_reviewed: !item.is_reviewed })
  }

  async function handleDelete() {
    if (!confirm('Delete this feedback permanently?')) return
    setDeleting(true)
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', item.id)
    setDeleting(false)
    if (!error) onDelete(item.id)
  }

  const date = new Date(item.created_at).toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className={`feedback-item ${item.is_reviewed ? 'reviewed' : 'pending'}`}>
      <div className="item-header">
        <span className="category-badge">{item.category}</span>
        <span className={`status-badge ${item.is_reviewed ? 'badge-reviewed' : 'badge-pending'}`}>
          {item.is_reviewed ? 'Reviewed' : 'Pending'}
        </span>
        <span className="item-time">{date}</span>
      </div>

      <p className="item-message">{item.message}</p>

      <div className="item-actions">
        <button
          className={`btn btn-sm ${item.is_reviewed ? 'btn-outline' : 'btn-success'}`}
          onClick={toggleReviewed}
          disabled={toggling}
        >
          {toggling ? '...' : item.is_reviewed ? 'Mark Pending' : 'Mark Reviewed'}
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
