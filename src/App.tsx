import { useEffect, useState } from 'react'

type CoreState = {
  E: number
  I: number
  C: number
  D: number
}

type SystemState = {
  core: CoreState
  uap: number
  decision: string
  drift: number
  prediction: {
    driftNext: number
    uapNext: number
    risk: string
  }
  federation: {
    nodes: Array<{ id: string; trust: number; mode?: string }>
  }
  source: string
}

const fallbackState: SystemState = {
  core: { E: 92, I: 88, C: 84, D: 0.18 },
  uap: 56,
  decision: 'AUDIT',
  drift: 18,
  prediction: { driftNext: 0.19, uapNext: 55, risk: 'LOW' },
  federation: {
    nodes: [
      { id: 'Core', trust: 0.95, mode: 'PRIMARY' },
      { id: 'Edge-1', trust: 0.82, mode: 'ADVISORY' },
      { id: 'Edge-2', trust: 0.76, mode: 'ADVISORY' },
      { id: 'External-A', trust: 0.61, mode: 'OBSERVE_ONLY' },
    ],
  },
  source: 'client-fallback',
}

function normalizeSystem(data: any): SystemState {
  const core = data?.core || fallbackState.core
  const uap = typeof data?.uap === 'number' ? data.uap : fallbackState.uap
  const decision = data?.policy?.enforcedDecision?.type || fallbackState.decision
  const prediction = data?.prediction || fallbackState.prediction

  return {
    core,
    uap,
    decision,
    drift: Math.round((core.D ?? 0.18) * 100),
    prediction,
    federation: data?.federation || fallbackState.federation,
    source: data?.source || 'system-api',
  }
}

async function fetchJson(path: string) {
  const response = await fetch(path, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json()
}

export default function App() {
  const [system, setSystem] = useState<SystemState>(fallbackState)
  const [apiStatus, setApiStatus] = useState('BOOTING')

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const [recommend, federation] = await Promise.all([
          fetchJson('/api/system'),
          fetchJson('/api/system?action=federation'),
        ])

        if (!active) return

        setSystem(normalizeSystem({
          ...recommend,
          federation: federation?.federation || fallbackState.federation,
        }))
        setApiStatus('CONNECTED')
      } catch {
        if (!active) return
        setSystem(fallbackState)
        setApiStatus('FALLBACK')
      }
    }

    load()
    const interval = setInterval(load, 5000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  async function sendOverride(action: string) {
    try {
      await fetch('/api/system?action=override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overrideAction: action, reason: 'Operator console action' }),
      })
      setApiStatus(`OVERRIDE:${action}`)
    } catch {
      setApiStatus(`LOCAL:${action}`)
    }
  }

  return (
    <main className="control-shell">
      <section className="hero-panel">
        <p className="eyebrow">REACTOR THEORY // RT9.1</p>
        <h1>ReactorCore Governance Control Plane</h1>
        <p className="subtitle">
          Connected to the clean stateless system API with deterministic fallback protection.
        </p>
      </section>

      <section className="control-grid">
        <article className="metric-card">
          <span>Unified Alignment Performance</span>
          <strong>{system.uap}</strong>
          <small>Current operational score</small>
        </article>

        <article className="metric-card">
          <span>Decision</span>
          <strong>{system.decision}</strong>
          <small>Policy posture</small>
        </article>

        <article className="metric-card">
          <span>Drift</span>
          <strong>{system.drift}%</strong>
          <small>Instability pressure</small>
        </article>

        <article className="metric-card">
          <span>Runtime</span>
          <strong>{apiStatus}</strong>
          <small>{system.source}</small>
        </article>
      </section>

      <section className="panel-row">
        <article className="control-panel">
          <h2>Operator Console</h2>
          <div className="button-row">
            <button onClick={() => sendOverride('RESUME')}>Resume</button>
            <button onClick={() => sendOverride('FORCE_REVIEW')}>Force Review</button>
            <button onClick={() => sendOverride('ESCALATE')}>Escalate</button>
            <button className="danger" onClick={() => sendOverride('LOCKDOWN')}>Lockdown</button>
          </div>
        </article>

        <article className="control-panel">
          <h2>Federation View</h2>
          <div className="node-list">
            {system.federation.nodes.map((node) => (
              <span key={node.id}>{node.id} · {Math.round(node.trust * 100)}% · {node.mode || 'NODE'}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="control-panel">
        <h2>Predictive Overlay</h2>
        <p>
          Projected drift: {Math.round(system.prediction.driftNext * 100)}% · projected UAP: {system.prediction.uapNext} · risk: {system.prediction.risk}
        </p>
      </section>
    </main>
  )
}
