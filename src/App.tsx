import RT11Dashboard from './RT11Dashboard'
import RT11Landing from './RT11Landing'
import RT11ChainStatus from './RT11ChainStatus'

export default function App() {
  return (
    <main className="site-shell app-mode">
      <aside className="sidebar">
        <nav className="nav-stack">
          <a href="#overview">Overview</a>
          <a href="#rt11-landing">RT11 Landing</a>
          <a href="#rt11-chain-status">Chain Status</a>
          <a href="#rt11">RT11 Dashboard</a>
        </nav>
      </aside>

      <section className="workspace" id="top">
        <RT11Landing />
        <RT11ChainStatus />
        <RT11Dashboard />
      </section>
    </main>
  )
}
