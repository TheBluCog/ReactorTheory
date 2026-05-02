import { useMemo, useState } from 'react'

type Recipient = { name: string; address: string; weight: number }

const treasuryWallet = '0x27f780E6d46dF69347f954674bbDF39924e3D644'
const recipients: Recipient[] = [
  { name: 'MediatorNode', address: '0x0000000000000000000000000000000000000001', weight: 7.22 },
  { name: 'SafetyNode', address: '0x0000000000000000000000000000000000000002', weight: 6.74 },
  { name: 'TeacherNode', address: '0x0000000000000000000000000000000000000003', weight: 6.69 },
  { name: 'BuilderNode', address: '0x0000000000000000000000000000000000000004', weight: 5.73 },
  { name: 'NoiseNode', address: '0x0000000000000000000000000000000000000005', weight: .25 },
]

export default function RT11Money() {
  const [amount, setAmount] = useState(1000)
  const rows = useMemo(() => {
    const ubiPool = amount * .8
    const opsPool = amount * .2
    const baseline = (ubiPool * .5) / recipients.length
    const weightedPool = ubiPool * .5
    const totalWeight = recipients.reduce((s, r) => s + r.weight, 0)
    return recipients.map(r => ({ ...r, payout: baseline + weightedPool * (r.weight / totalWeight), ubiPool, opsPool }))
  }, [amount])
  return <section className="sim-layout elite-sim">
    <div className="rt-card"><div className="system-pill">MONEY LAYER</div><p className="eyebrow">DRY-RUN PAYOUT</p><h2>Preview treasury distribution</h2><label className="range"><span>Test Treasury <b>{amount}</b></span><input type="range" min="100" max="10000" step="100" value={amount} onChange={e=>setAmount(Number(e.target.value))}/></label><div className="kpi-grid"><div><span>UBI Pool</span><b>{Math.round(amount*.8)}</b></div><div><span>Ops Pool</span><b>{Math.round(amount*.2)}</b></div></div></div>
    <div className="rt-card"><div className="system-pill">TREASURY</div><p className="eyebrow">CANONICAL WALLET</p><h2>Settlement Anchor</h2><p className="mono">{treasuryWallet}</p><p>Execution is disabled until Amoy deployment, contract verification, recipient allowlist, and multisig approval are complete.</p></div>
    <div className="rt-card"><div className="system-pill">PAYOUT PREVIEW</div><p className="eyebrow">RECIPIENTS</p><div className="agent-list">{rows.map(r=><button key={r.name}><strong>{r.name}</strong><small>{r.address.slice(0,8)}…{r.address.slice(-4)}</small><span>Dry payout {r.payout.toFixed(2)}</span></button>)}</div></div>
  </section>
}
