import RT11Dashboard from './RT11Dashboard'
import RT11Landing from './RT11Landing'
import RT11Wallet from './RT11Wallet'

export default function App() {
  return (
    <main className="rt11-mobile-shell">
      <header className="rt11-mobile-header">
        <strong>RT11</strong>
        <span>Resonance Economics</span>
      </header>

      <nav className="rt11-mobile-nav">
        <a href="#rt11-landing">Landing</a>
        <a href="#rt11-wallet">Wallet</a>
        <a href="#rt11-chain-status">Chain</a>
        <a href="#rt11">Dashboard</a>
      </nav>

      <section className="rt11-mobile-content">
        <RT11Landing />
        <RT11Wallet />
        <section className="glass-card" id="rt11-chain-status">
          <p className="eyebrow">LIVE CHAIN STATUS</p>
          <h2>Chain status safe mode</h2>
          <p>Wallet provider is configured at the app root. Live contract reads will activate after deployed addresses are available.</p>
        </section>
        <RT11Dashboard />
      </section>
    </main>
  )
}
