import { useMemo, useState } from 'react'
import RT11Wallet from './RT11Wallet'

type Agent = { name:string; role:string; E:number; I:number; C:number; D:number; impact:number; entropy:number }
type Tab = 'overview'|'simulator'|'wallet'|'chain'|'governance'

const agents: Agent[] = [
  { name:'MediatorNode', role:'Conflict Resolution', E:5.5, I:.93, C:.92, D:.30, impact:1.7, entropy:.45 },
  { name:'SafetyNode', role:'AI Alignment', E:7.5, I:.90, C:.86, D:.50, impact:2.0, entropy:.65 },
  { name:'TeacherNode', role:'Education', E:7.0, I:.92, C:.88, D:.45, impact:1.4, entropy:.60 },
  { name:'BuilderNode', role:'Infrastructure', E:8.0, I:.82, C:.80, D:.70, impact:1.8, entropy:.80 },
  { name:'NoiseNode', role:'Extraction / Drift', E:8.5, I:.35, C:.30, D:2.50, impact:.55, entropy:2.20 },
]

const uap = (a:Agent) => (a.E*a.I*a.C)/Math.max(a.D,.0001)
const resonance = (a:Agent) => ((a.E*a.I*a.C)*a.impact)/Math.max(a.D*a.entropy,.0001)
const clamp = (n:number,min:number,max:number)=>Math.max(min,Math.min(max,n))

function Overview({ setTab }:{setTab:(t:Tab)=>void}) {
  return <section className="rt-card hero-card">
    <p className="eyebrow">ETHIC VAULT / RT11</p>
    <h1>Programmable trust for AI governance.</h1>
    <p className="lead">RT11 scores contribution, suppresses drift, and routes treasury value through auditable resonance economics.</p>
    <div className="action-row"><button className="primary" onClick={()=>setTab('simulator')}>Run Simulator</button><button onClick={()=>setTab('wallet')}>Connect Wallet</button></div>
    <div className="proof-row"><span>Math</span><span>Simulation</span><span>Contracts</span><span>Polygon</span></div>
  </section>
}

function Simulator() {
  const [treasury,setTreasury]=useState(1000)
  const [selected,setSelected]=useState(agents[0])
  const rows=useMemo(()=>{
    const scored=agents.map(a=>{ const R=resonance(a); const penalty=Math.max(0,a.D*(1-a.C)); const weight=clamp(1+Math.log1p(R)-.15*penalty,.25,10); return {...a,R,U:uap(a),weight,penalty} })
    const total=scored.reduce((s,a)=>s+a.weight,0); const pool=treasury*.8; const base=(pool*.5)/scored.length
    return scored.map(a=>({...a,payout:base+(pool*.5)*(a.weight/total)}))
  },[treasury])
  const avgI=agents.reduce((s,a)=>s+a.I,0)/agents.length; const avgC=agents.reduce((s,a)=>s+a.C,0)/agents.length; const avgD=agents.reduce((s,a)=>s+a.D,0)/agents.length; const avgEntropy=agents.reduce((s,a)=>s+a.entropy,0)/agents.length; const avgR=rows.reduce((s,a)=>s+a.R,0)/rows.length
  const trust=clamp((avgI+avgC)/2,0,1); const cooperation=clamp(avgR/(avgR+25),0,1); const entropy=clamp((avgD+avgEntropy)/2,.05,5); const stability=(trust*cooperation*avgI)/entropy
  const active=rows.find(r=>r.name===selected.name) || rows[0]
  return <section className="sim-layout">
    <div className="rt-card"><p className="eyebrow">SIMULATOR</p><h2>RT11 Resonance Engine</h2><label className="range"><span>Treasury Inflow <b>{treasury}</b></span><input type="range" min="100" max="10000" step="100" value={treasury} onChange={e=>setTreasury(Number(e.target.value))}/></label><div className="kpi-grid"><div><span>UBI Pool</span><b>{Math.round(treasury*.8)}</b></div><div><span>Ops Pool</span><b>{Math.round(treasury*.2)}</b></div><div><span>Trust</span><b>{Math.round(trust*100)}%</b></div><div><span>Stability</span><b>{stability.toFixed(3)}</b></div></div></div>
    <div className="rt-card"><p className="eyebrow">AGENTS</p><div className="agent-list">{rows.map(r=><button key={r.name} className={selected.name===r.name?'active':''} onClick={()=>setSelected(r)}><strong>{r.name}</strong><small>{r.role}</small><span>R {r.R.toFixed(1)} · Pay {r.payout.toFixed(1)}</span></button>)}</div></div>
    <div className="rt-card"><p className="eyebrow">SELECTED STATE</p><h2>{active.name}</h2><p>{active.role}</p><div className="kpi-grid"><div><span>UAP</span><b>{active.U.toFixed(2)}</b></div><div><span>Resonance</span><b>{active.R.toFixed(2)}</b></div><div><span>Drift</span><b>{active.D}</b></div><div><span>Payout</span><b>{active.payout.toFixed(2)}</b></div></div></div>
  </section>
}

function ChainStatus(){ return <section className="rt-card"><p className="eyebrow">CHAIN STATUS</p><h2>Polygon readiness</h2><div className="status-list"><p><b>Treasury:</b> 0x27f780E6d46dF69347f954674bbDF39924e3D644</p><p><b>Anchor:</b> 0x9971c17e2d9638cbb63a2d2670db69fa4f335a8a98b222777a3838acf0b2b3e8</p><p><b>Status:</b> Amoy deployment pending</p></div></section> }
function Governance(){ return <section className="rt-card"><p className="eyebrow">GOVERNANCE</p><h2>Safety gates</h2><div className="checklist"><span>✓ Testnet first</span><span>✓ Dry-run payout</span><span>✓ Recipient allowlist</span><span>✓ Multisig approval</span><span>□ Mainnet execution</span></div></section> }

export default function App(){ const [tab,setTab]=useState<Tab>('overview'); return <main className="app-shell"><header className="topbar"><div><strong>RT11</strong><span>Resonance Economics</span></div><a href="https://github.com/TheBluCog/ReactorTheory" target="_blank" rel="noreferrer">GitHub</a></header><nav className="tabs">{(['overview','simulator','wallet','chain','governance'] as Tab[]).map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</nav><section className="app-content">{tab==='overview'&&<Overview setTab={setTab}/>} {tab==='simulator'&&<Simulator/>} {tab==='wallet'&&<RT11Wallet/>} {tab==='chain'&&<ChainStatus/>} {tab==='governance'&&<Governance/>}</section></main> }
