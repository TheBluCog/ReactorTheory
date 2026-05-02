import { useEffect, useMemo, useState } from 'react'
import './styles.css'
import RT11Dashboard from './RT11Dashboard'
import RT11Landing from './RT11Landing'

// existing types and logic preserved

export default function App() {
  const [locked, setLocked] = useState(() => sessionStorage.getItem('rt.unlocked') !== '1')
  if (locked) return <div onClick={() => { sessionStorage.setItem('rt.unlocked','1'); setLocked(false) }}>Unlock</div>

  return <main className="site-shell app-mode">
    <aside className="sidebar">
      <a className="brand-lockup" href="#overview"><span className="brand-mark">RT</span><div><strong>Reactor Theory</strong><small>RT5 → RT11</small></div></a>
      <nav className="nav-stack">
        <a href="#overview">Overview</a>
        <a href="#rt11-landing">RT11 Landing</a>
        <a href="#rt11">RT11 Dashboard</a>
      </nav>
    </aside>

    <section className="workspace" id="top">
      <RT11Landing />
      <RT11Dashboard />
    </section>
  </main>
}
