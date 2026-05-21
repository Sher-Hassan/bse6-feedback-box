import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import FeedbackForm from './components/FeedbackForm'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import './App.css'

export default function App() {
  const [session, setSession] = useState(undefined)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) setShowLogin(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    )
  }

  if (session) {
    return <AdminDashboard session={session} />
  }

  return (
    <div className="public-view">
      <header className="site-header">
        <div className="header-inner">
          <h1 className="site-title">Anonymous Feedback Box</h1>
          <p className="site-subtitle">Share your thoughts freely — no account needed</p>
        </div>
      </header>

      <main className="main-content">
        {showLogin ? (
          <AdminLogin onCancel={() => setShowLogin(false)} />
        ) : (
          <>
            <FeedbackForm />
            <button
              className="admin-link"
              onClick={() => setShowLogin(true)}
            >
              Admin
            </button>
          </>
        )}
      </main>
    </div>
  )
}
