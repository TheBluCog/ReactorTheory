import { useMemo, useState } from 'react'

type Recipient = { name: string; address: string; payload: { energy:number; intent:number; control:number; drift:number; impact:number; entropy:number } }

type ApiProof = { status:number; ok:boolean; timestamp:string; request:any; response:any } | null

const treasuryWallet = '0x27f780E6d46dF69347f954674bbDF39924e3D644'
const treasuryRouter = import.meta.env.VITE_AMOY_TREASURY_ROUTER_ADDRESS || ''

const recipients: Recipient[] = [
  { name:'Teacher', address:'0x0000000000000000000000000000000000000001', payload:{ energy:7, intent:.92, control:.88, drift:.45, impact:1.4, entropy:.6 } },
  { name:'Mediator', address:'0x0000000000000000000000000000000000000002', payload:{ energy:5.5, intent:.93, control:.92, drift:.3, impact:1.7, entropy:.45 } },
  { name:'Builder', address:'0x0000000000000000000000000000000000000003', payload:{ energy:8, intent:.82, control:.8, drift:.7, impact:1.8, entropy:.8 } },
  { name:'Safety Reviewer', address:'0x0000000000000000000000000000000000000004', payload:{ energy:7.5, intent:.9, control:.86, drift:.5, impact:2, entropy:.65 } },
  { name:'Spammer', address:'0x0000000000000000000000000000000000000005', payload:{ energy:8.5, intent:.35, control:.3, drift:2.5, impact:.55, entropy:2.2 } },
]

export default function RT11Money() {
  const [amount,setAmount]=useState(1000)
  const [selected,setSelected]=useState(recipients[0])
  const [proof,setProof]=useState<ApiProof>(null)
  const [status,setStatus]=useState<'idle'|'loading'|'success'|'error'>('idle')
  const [txState,setTxState]=useState('contracts_not_deployed')

  const rows=useMemo(()=>{
    const ubiPool=amount*.8
    const opsPool=amount*.2
    const baseline=(ubiPool*.5)/recipients.length
    const weightedPool=ubiPool*.5
    const weights=recipients.map(r=>{
      const p=r.payload
      const resonance=((p.energy*p.intent*p.control)*p.impact)/Math.max(p.drift*p.entropy,.0001)
      const weight=Math.max(.25,Math.log1p(resonance))
      return {...r,resonance,weight}
    })
    const total=weights.reduce((s,r)=>s+r.weight,0)
    return weights.map(r=>({...r,payout:baseline+weightedPool*(r.weight/total),ubiPool,opsPool}))
  },[amount])

  async function runApiScore(){
    setStatus('loading')
    try{
      const res=await fetch('/api/rt11/score',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(selected.payload)})
      const data=await res.json()
      setProof({status:res.status,ok:res.ok,timestamp:new Date().toISOString(),request:selected.payload,response:data})
      setStatus(res.ok?'success':'error')
    }catch(e:any){
      setProof({status:0,ok:false,timestamp:new Date().toISOString(),request:selected.payload,response:{error:String(e?.message||e)}})
      setStatus('error')
    }
  }

  function prepareExecution(){
    if(!treasuryRouter){ setTxState('blocked_missing_amoy_contract'); return }
    setTxState('ready_requires_wallet_signature')
  }

  const selectedRow=rows.find(r=>r.name===selected.name) || rows[0]
  const apiResonance=proof?.response?.output?.resonance
  const apiPreview=apiResonance ? Number(apiResonance*10).toFixed(2) : '—'

  return <section className="sim-layout elite-sim">
    <div className="rt-card"><div className="system-pill">PAYOUT CONTROL</div><p className="eyebrow">API-CONNECTED PREVIEW</p><h2>Score first. Preview payout second. Execute only after proof.</h2><label className="range"><span>Test Treasury <b>{amount}</b></span><input type="range" min="100" max="10000" step="100" value={amount} onChange={e=>setAmount(Number(e.target.value))}/></label><div className="kpi-grid"><div><span>Reward Pool</span><b>{Math.round(amount*.8)}</b></div><div><span>Ops / Safety</span><b>{Math.round(amount*.2)}</b></div><div><span>API Status</span><b>{status}</b></div><div><span>API Preview</span><b>{apiPreview}</b></div></div><div className="action-row"><button className="primary" onClick={runApiScore}>{status==='loading'?'Calling API…':'Run API Score'}</button><button onClick={prepareExecution}>Prepare Testnet Execution</button></div></div>

    <div className="rt-card"><div className="system-pill">RECIPIENTS</div><p className="eyebrow">SELECT WORK TYPE</p><div className="agent-list">{rows.map(r=><button key={r.name} className={selected.name===r.name?'active':''} onClick={()=>setSelected(r)}><strong>{r.name}</strong><small>{r.address.slice(0,8)}…{r.address.slice(-4)}</small><span>Local preview {r.payout.toFixed(2)} · Score {r.resonance.toFixed(1)}</span></button>)}</div></div>

    <div className="rt-card"><div className="system-pill">LIVE JSON</div><p className="eyebrow">API RESPONSE</p><h2>{selected.name}</h2><p>{selected.payload.drift > 1 ? 'Risk is high, payout should be reduced.' : 'Usefulness is higher, payout should increase.'}</p><pre>{proof?JSON.stringify(proof,null,2):'Click “Run API Score” to show live JSON here.'}</pre></div>

    <div className="rt-card"><div className="system-pill">PROOF PANEL</div><p className="eyebrow">EXECUTION STATUS</p><h2>{treasuryRouter?'Contract configured':'Awaiting Amoy contract'}</h2><div className="checklist"><span>Score Source: Live API</span><span>Payout Source: API-derived preview</span><span>Execution State: {txState}</span><span>Treasury: {treasuryWallet}</span>{treasuryRouter&&<span>TreasuryRouter: {treasuryRouter}</span>}</div><p>Real payout execution remains locked until Amoy deployment, contract funding, recipient allowlist, and wallet signature are ready.</p></div>
  </section>
}
