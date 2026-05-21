import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import FeedbackForm from './components/FeedbackForm'
import SuccessScreen from './components/SuccessScreen'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import './App.css'

/* ── Tiny SVG icons ── */
export function Arrow({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8h9M9 4.5L12.5 8 9 11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
export function Chevron({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 6l4.5 4.5L12.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Floating pill nav ── */
function Nav({ active = 'Submit', showSpeakUp = true, onAdminClick, onSubmitClick }) {
  return (
    <nav className="nav">
      <div className="pill pill--logo">
        <div className="mark">L</div>
        <div className="wordmark">LAB.CC</div>
      </div>

      <div className="pill pill--nav">
        {['Submit','Admin'].map(label => (
          <a
            key={label}
            href="#"
            className={active === label ? 'active' : ''}
            onClick={e => {
              e.preventDefault()
              if (label === 'Admin') onAdminClick?.()
              else onSubmitClick?.()
            }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* <div className="pill pill--right">
        <span className="lang">English <Chevron /></span>
        {showSpeakUp && (
          <a href="#" className="cta" onClick={e => e.preventDefault()}>
            <span className="arr"><Arrow size={12} /></span>
            Speak Up
          </a>
        )}
      </div> */}
    </nav>
  )
}

/* ── Anonymous mode toggle ── */
function ModeToggle({ current = 'On' }) {
  return (
    <div className="modee">
      {/* <span>Anonymous mode:</span>
      <span className="switch">
        <span className={current === 'On' ? 'on' : ''}>On</span>
        <span className={current === 'Off' ? 'on' : ''}>Off</span>
      </span> */}
    </div>
  )
}

export { Nav, ModeToggle }

export default function App() {
  const [session, setSession] = useState(undefined)
  const [view, setView] = useState('form') // 'form' | 'success' | 'login'
  const [lastSubmission, setLastSubmission] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) setView('form')
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

  /* Admin is signed in */
  if (session) {
    return (
      <div className="app-shell">
        <Nav active="Admin" showSpeakUp={false} onSubmitClick={() => supabase.auth.signOut()} />
        <div className="page-frame">
          <AdminDashboard session={session} />
        </div>
      </div>
    )
  }

  /* Public views */
  if (view === 'success') {
    return (
      <div className="app-shell">
        <Nav active="Submit" onAdminClick={() => setView('login')} />
        <div className="page-frame">
          <SuccessScreen submission={lastSubmission} onReset={() => setView('form')} />
        </div>
        <ModeToggle current="On" />
      </div>
    )
  }

  if (view === 'login') {
    return (
      <div className="app-shell">
        <Nav active="Admin" showSpeakUp={false} />
        <div className="page-frame">
          <AdminLogin onCancel={() => setView('form')} />
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Nav active="Submit" onAdminClick={() => setView('login')} />
      <div className="page-frame">
        <FeedbackForm
          onSuccess={(data) => { setLastSubmission(data); setView('success') }}
        />
      </div>
      <ModeToggle current="On" />
    </div>
  )
}
