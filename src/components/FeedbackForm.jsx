import { useState } from 'react'
import { supabase } from '../supabaseClient'

const CATEGORIES = ['General', 'Course Content', 'Teaching Quality', 'Facilities', 'Administration', 'Other']

export default function FeedbackForm() {
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim()) {
      setError('Please write your feedback before submitting.')
      return
    }
    setLoading(true)
    setError('')

    const { error: dbError } = await supabase
      .from('feedback')
      .insert({ message: message.trim(), category })

    setLoading(false)
    if (dbError) {
      setError('Failed to submit feedback. Please try again.')
      return
    }

    setSubmitted(true)
    setMessage('')
    setCategory(CATEGORIES[0])
  }

  if (submitted) {
    return (
      <div className="card success-card">
        <div className="success-icon">✓</div>
        <h2>Feedback Received!</h2>
        <p>Your anonymous feedback has been submitted successfully. Thank you!</p>
        <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
          Submit Another
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="card-title">Share Your Feedback</h2>
      <p className="card-subtitle">Your identity is never recorded.</p>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="form-select"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Your Feedback</label>
          <textarea
            id="message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Write your feedback here..."
            rows={5}
            className="form-textarea"
            maxLength={1000}
          />
          <span className="char-count">{message.length}/1000</span>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Anonymously'}
        </button>
      </form>
    </div>
  )
}
