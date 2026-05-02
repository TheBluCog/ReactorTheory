import { useMemo, useState, useEffect } from 'react'
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { TREASURY_ROUTER_ABI } from './contracts/treasuryRouter'
import { useTxFeed } from './hooks/useTxFeed'

// ...existing types remain

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
  const { address } = useAccount()
  const chainId = useChainId()
  const { writeContractAsync } = useWriteContract()
  const { feed, addEvent } = useTxFeed()

  const [amount,setAmount]=useState(1000)
  const [selected,setSelected]=useState(recipients[0])
  const [proof,setProof]=useState<ApiProof>(null)
  const [status,setStatus]=useState<'idle'|'loading'|'success'|'error'>('idle')
  const [txHash,setTxHash]=useState<`0x${string}` | undefined>()

  const { data: receipt } = useWaitForTransactionReceipt({ hash: txHash, query: { enabled: !!txHash } })

  useEffect(() => {
    if (receipt && txHash) {
      addEvent({
        type: 'tx_confirmed',
        tx: txHash,
        network: 'Polygon Amoy',
        detail: 'Transaction confirmed on-chain'
      })
    }
  }, [receipt, txHash])

  const rows=useMemo(()=>{
    const ubiPool=amount*.8
    const baseline=(ubiPool*.5)/recipients.length
    const weightedPool=ubiPool*.5
    const weights=recipients.map(r=>{
      const p=r.payload
      const resonance=((p.energy*p.intent*p.control)*p.impact)/Math.max(p.drift*p.entropy,.0001)
      const weight=Math.max(.25,Math.log1p(resonance))
      return {...r,resonance,weight}
    })
    const total=weights.reduce((s,r)=>s+r.weight,0)
    return weights.map(r=>({...r,payout:baseline+weightedPool*(r.weight/total)}))
  },[amount])

  async function runApiScore(){
    setStatus('loading')
    const res=await fetch('/api/rt11/score',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(selected.payload)})
    const data=await res.json()
    setProof({status:res.status,ok:res.ok,timestamp:new Date().toISOString(),request:selected.payload,response:data})
    setStatus(res.ok?'success':'error')
    addEvent({ type:'api_score_ready', network:'local', detail:'API score computed' })
  }

  async function execute(){
    if(!treasuryRouter){
      addEvent({ type:'tx_blocked', network:'local', detail:'Missing TreasuryRouter address' })
      return
    }
    if(!address){
      addEvent({ type:'tx_blocked', network:'local', detail:'Wallet not connected' })
      return
    }

    try{
      addEvent({ type:'tx_signing', network:'Polygon Amoy', detail:'Awaiting wallet signature' })

      const recipientsList = rows.map(r=>r.address)
      const amounts = rows.map(r=>BigInt(Math.floor(r.payout*1e6)))

      const hash = await writeContractAsync({
        address: treasuryRouter,
        abi: TREASURY_ROUTER_ABI,
        functionName: 'distribute',
        args: [recipientsList, amounts]
      })

      setTxHash(hash)

      addEvent({
        type:'tx_submitted',
        tx: hash,
        network:'Polygon Amoy',
        detail:'Transaction submitted'
      })

    }catch(e:any){
      addEvent({ type:'tx_failed', network:'Polygon Amoy', detail:String(e?.message||e) })
    }
  }

  return <section className="sim-layout elite-sim">
    <div className="rt-card"><div className="system-pill">EXECUTION</div><button className="primary" onClick={execute}>Execute Testnet Payout</button><p>Wallet: {address||'not connected'}</p><p>Chain: {chainId}</p></div>
  </section>
}
