import RT11Dashboard from './RT11Dashboard'
import RT11Landing from './RT11Landing'

export default function App() {
  return (
    <main className="site-shell app-mode">
      <aside className="sidebar">
        <nav className="nav-stack">
          <a href="#overview">Overview</a>
          <a href="#rt11-landing">RT11 Landing</a>
          <a href="#rt11">RT11 Dashboard</a>
        </nav>
      </aside>

      <section className="workspace" id="top">
        <RT11Landing />
        <section className="glass-card" id="rt11-chain-status">
          <p className="eyebrow">LIVE CHAIN STATUS</p>
          <h2>Chain status paused for safe render</h2>
          <p>Wallet and wagmi-based reads are disabled until provider configuration is finalized.</p>
        </section>
        <RT11Dashboard />
      </section>
    </main>
  )
}
