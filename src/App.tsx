const core = { E: 92, I: 88, C: 84, D: 0.18 }
const uap = Math.round((core.E / 100) * (core.I / 100) * (core.C / 100) * (1 - core.D) * 100)
const decision = uap < 60 ? 'AUDIT' : 'OPTIMIZE'
const drift = Math.round(core.D * 100)

export default function App() {
  return (
    <main className="control-shell">
      <section className="hero-panel">
        <p className="eyebrow">REACTOR THEORY // RT9.1</p>
        <h1>ReactorCore Governance Control Plane</h1>
        <p className="subtitle">
          Stable client runtime. No backend dependency required. API layer is optional and non-blocking.
        </p>
      </section>

      <section className="control-grid">
        <article className="metric-card">
          <span>Unified Alignment Performance</span>
          <strong>{uap}</strong>
          <small>Current operational score</small>
        </article>

        <article className="metric-card">
          <span>Decision</span>
          <strong>{decision}</strong>
          <small>Policy posture</small>
        </article>

        <article className="metric-card">
          <span>Drift</span>
          <strong>{drift}%</strong>
          <small>Instability pressure</small>
        </article>

        <article className="metric-card">
          <span>Runtime</span>
          <strong>LIVE</strong>
          <small>Client-safe mode</small>
        </article>
      </section>

      <section className="panel-row">
        <article className="control-panel">
          <h2>Operator Console</h2>
          <div className="button-row">
            <button>Resume</button>
            <button>Force Review</button>
            <button>Escalate</button>
            <button className="danger">Lockdown</button>
          </div>
        </article>

        <article className="control-panel">
          <h2>Federation View</h2>
          <div className="node-list">
            <span>Core · 95%</span>
            <span>Edge-1 · 82%</span>
            <span>Edge-2 · 76%</span>
            <span>External-A · 61%</span>
          </div>
        </article>
      </section>

      <section className="control-panel">
        <h2>Predictive Overlay</h2>
        <p>Projected drift: 18% · projected UAP: {uap} · risk: LOW</p>
      </section>
    </main>
  )
}
