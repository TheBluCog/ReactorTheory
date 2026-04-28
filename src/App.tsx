// FINAL FINAL TIER DEPLOY
import { useMemo, useState, useEffect } from 'react'
import './styles.css'

function LockScreen({ onUnlock }: any) {
  return (
    <div className="lock-screen" onClick={onUnlock}>
      <div className="lock-content">
        <div className="face-id-ring" />
        <p>Face ID</p>
      </div>
    </div>
  )
}

function InvestorDashboard() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const load = () => {
      const data = JSON.parse(localStorage.getItem('rt.analytics.events') || '[]')
      setEvents(data.reverse())
    }
    load()
    window.addEventListener('rt-track', load)
    return () => window.removeEventListener('rt-track', load)
  }, [])

  return (
    <div className="dashboard" id="dashboard">
      <h2>Live Engagement</h2>
      {events.map((e, i) => (
        <div key={i} className="event">
          <strong>{e.event}</strong>
          <span>{new Date(e.at).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [locked, setLocked] = useState(true)

  if (locked) return <LockScreen onUnlock={() => setLocked(false)} />

  return (
    <div className="app-shell">
      <h1>Reactor Theory</h1>
      <p>Decision Intelligence for High-Risk Systems</p>
      <a href="#simulator">Open Simulator</a>
      <InvestorDashboard />

      <div className="tab-bar">
        <a href="#overview">Home</a>
        <a href="#simulator">Sim</a>
        <a href="#pitch">Pitch</a>
        <a href="#dashboard">Data</a>
      </div>
    </div>
  )
}
