import { useMemo, useState } from 'react'

type Agent = {
  name: string
  role: string
  E: number
  I: number
  C: number
  D: number
  networkImpact: number
  entropy: number
}

const canonical = {
  wallet: '0x27f780E6d46dF69347f954674bbDF39924e3D644',
  idmFrom: '0x5c90e838c809b7c5b91a41b3271599ae2172d23e',
  idmTo: '0x09522b7807bb8ebfddcd5efffaacc742a660bfbd',
  tx: '0x9971c17e2d9638cbb63a2d2670db69fa4f335a8a98b222777a3838acf0b2b3e8',
}

const agents: Agent[] = [
  { name: 'TeacherNode', role: 'Education', E: 7.0, I: .92, C: .88, D: .45, networkImpact: 1.4, entropy: .60 },
  { name: 'CareNode', role: 'Caregiving', E: 6.5, I: .95, C: .90, D: .35, networkImpact: 1.5, entropy: .50 },
  { name: 'BuilderNode', role: 'Infrastructure', E: 8.0, I: .82, C: .80, D: .70, networkImpact: 1.8, entropy: .80 },
  { name: 'SafetyNode', role: 'AI Alignment', E: 7.5, I: .90, C: .86, D: .50, networkImpact: 2.0, entropy: .65 },
  { name: 'NoiseNode', role: 'Extraction / Drift', E: 8.5, I: .35, C: .30, D: 2.50, networkImpact: .55, entropy: 2.20 },
  { name: 'MediatorNode', role: 'Conflict Resolution', E: 5.5, I: .93, C: .92, D: .30, networkImpact: 1.7, entropy: .45 },
]

function uap(a: Agent) { return (a.E * a.I * a.C) / Math.max(a.D, 0.000001) }
function resonance(a: Agent) { return ((a.E * a.I * a.C) * a.networkImpact) / Math.max(a.D * a.entropy, 0.000001) }
function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)) }

export default function RT11Dashboard() {
  const [treasury, setTreasury] = useState(1000)
  const [selected, setSelected] = useState<Agent>(agents[5])

  const rows = useMemo(() => {
    const scored = agents.map(a => {
      const R = resonance(a)
      const entropyPenalty = Math.max(0, a.D * (1 - a.C))
      const weight = clamp(1 + Math.log1p(R) - .15 * entropyPenalty, .25, 10)
      return { ...a, UAP: uap(a), R, entropyPenalty, weight }
    })
    const totalWeight = scored.reduce((s, a) => s + a.weight, 0)
    const ubiPool = treasury * .8
    const opsPool = treasury * .2
    const baseline = (ubiPool * .5) / scored.length
    return scored.map(a => ({ ...a, payout: baseline + (ubiPool * .5) * (a.weight / totalWeight), ubiPool, opsPool }))
  }, [treasury])

  const avgI = agents.reduce((s, a) => s + a.I, 0) / agents.length
  const avgC = agents.reduce((s, a) => s + a.C, 0) / agents.length
  const avgD = agents.reduce((s, a) => s + a.D, 0) / agents.length
  const avgEntropy = agents.reduce((s, a) => s + a.entropy, 0) / agents.length
  const avgRes = rows.reduce((s, a) => s + a.R, 0) / rows.length
  const trust = clamp((avgI + avgC) / 2, 0, 1)
  const cooperation = clamp(avgRes / (avgRes + 25), 0, 1)
  const entropy = clamp((avgD + avgEntropy) / 2, .05, 5)
  const stability = (trust * cooperation * avgI) / entropy
  const selectedScore = { UAP: uap(selected), R: resonance(selected) }

  return <section className="rt11-panel" id="rt11">
    <div className="section-heading">
      <p className="eyebrow">RT11 LIVE UI</p>
      <h2>Resonance Economics Dashboard</h2>
      <p>Executable interface for UAP, Resonance, Cred-NFT weighting, 80/20 treasury routing, and dynamic UBI allocation.</p>
    </div>

    <div className="rt11-hero-grid">
      <article className="glass-card rt11-formula"><p className="eyebrow">CORE ENGINE</p><pre>UAP = (E × I × C) / D{`\n`}R = ((E × I × C) × NetworkImpact) / (Drift × Entropy)</pre></article>
      <article className="glass-card"><p className="eyebrow">TREASURY INFLOW</p><label className="slider-row"><span>Epoch Treasury <b>{treasury} units</b></span><input type="range" min="100" max="10000" step="100" value={treasury} onChange={e => setTreasury(Number(e.target.value))}/></label><div className="result-grid"><div><span>UBI + Public Goods</span><strong>{Math.round(treasury * .8)}</strong></div><div><span>Ops + Governance</span><strong>{Math.round(treasury * .2)}</strong></div></div></article>
      <article className="glass-card"><p className="eyebrow">CIVILIZATION STATE</p><div className="result-grid"><div><span>Trust</span><strong>{Math.round(trust * 100)}%</strong></div><div><span>Cooperation</span><strong>{Math.round(cooperation * 100)}%</strong></div><div><span>Entropy</span><strong>{entropy.toFixed(2)}</strong></div><div><span>Stability</span><strong>{stability.toFixed(3)}</strong></div></div></article>
    </div>

    <div className="rt11-table glass-card">
      <h3>Agent Resonance + UBI Allocation</h3>
      <div className="rt11-rows">
        {rows.map(r => <button key={r.name} onClick={() => setSelected(r)} className={selected.name === r.name ? 'active' : ''}>
          <strong>{r.name}</strong><span>{r.role}</span><b>R {r.R.toFixed(2)}</b><b>Pay {r.payout.toFixed(2)}</b>
        </button>)}
      </div>
    </div>

    <div className="rt11-hero-grid">
      <article className="glass-card"><p className="eyebrow">SELECTED NODE</p><h3>{selected.name}</h3><p>{selected.role}</p><div className="result-grid"><div><span>UAP</span><strong>{selectedScore.UAP.toFixed(2)}</strong></div><div><span>Resonance</span><strong>{selectedScore.R.toFixed(2)}</strong></div><div><span>Drift</span><strong>{selected.D.toFixed(2)}</strong></div><div><span>Entropy</span><strong>{selected.entropy.toFixed(2)}</strong></div></div></article>
      <article className="glass-card"><p className="eyebrow">CANONICAL POLYGON ANCHORS</p><p><strong>Wallet</strong><br />{canonical.wallet}</p><p><strong>IDM</strong><br />{canonical.idmFrom} → {canonical.idmTo}</p><p><strong>Tx</strong><br />{canonical.tx}</p></article>
      <article className="glass-card"><p className="eyebrow">PROTOCOL FLOW</p><pre>Activity → UAP → Resonance → CredNFT → TreasuryRouter → Dynamic UBI</pre><p>RT11 rewards Energy × Intent × Coherence and penalizes Drift × Entropy.</p></article>
    </div>
  </section>
}
