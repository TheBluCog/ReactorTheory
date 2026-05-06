import { useMemo, useState, useEffect } from 'react'
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { TREASURY_ROUTER_ABI } from './contracts/treasuryRouter'
import { useTxFeed } from './hooks/useTxFeed'
import { rt11Config } from './config/rt11.config'
import { contractExecutor } from './services/rt11/contractExecutor'
import { useRT11State } from './hooks/useRT11State'

type Address = `0x${string}`

type Recipient = {
  name: string
  address: Address
  payload: {
    energy: number
    intent: number
    control: number
    drift: number
    impact: number
    entropy: number
  }
}

const treasuryRouter = (import.meta.env.VITE_AMOY_TREASURY_ROUTER_ADDRESS || '0x0000000000000000000000000000000000000000') as Address

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
  const { addEvent } = useTxFeed()
  const [rt11State, dispatch] = useRT11State()

  const [amount] = useState(1000)

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: rt11State.txHash as Address,
    query: { enabled: !!rt11State.txHash }
  })

  useEffect(() => {
    if (receipt && rt11State.txHash && rt11State.status === 'TX_SUBMITTED') {
      dispatch({ type: 'TX_CONFIRMED' })
      addEvent({
        type: 'tx_confirmed',
        tx: rt11State.txHash as Address,
        network: 'Polygon Amoy',
        detail: 'Transaction confirmed on-chain'
      })
    }
  }, [receipt, rt11State.txHash, rt11State.status, addEvent, dispatch])

  const rows = useMemo(() => {
    const ubiPool = amount * .8
    const baseline = (ubiPool * .5) / recipients.length
    const weightedPool = ubiPool * .5
    const weights = recipients.map(r => {
      const p = r.payload
      const resonance = ((p.energy * p.intent * p.control) * p.impact) / Math.max(p.drift * p.entropy, .0001)
      const weight = Math.max(.25, Math.log1p(resonance))
      return { ...r, resonance, weight }
    })
    const total = weights.reduce((s, r) => s + r.weight, 0)
    return weights.map(r => ({ ...r, payout: baseline + weightedPool * (r.weight / total) }))
  }, [amount])

  async function execute() {
    try {
      const recipientsList: readonly Address[] = rows.map(r => r.address)

      // Validate addresses before execution mode check
      contractExecutor.validateAddresses(recipientsList)

      // Hard check for execution mode
      contractExecutor.verifyExecutionMode()

      if (treasuryRouter === '0x0000000000000000000000000000000000000000') {
        dispatch({ type: 'TX_BLOCKED', reason: 'Missing TreasuryRouter address' })
        addEvent({ type:'tx_blocked', network:'local', detail:'Missing TreasuryRouter address' })
        return
      }
      if (!address) {
        dispatch({ type: 'TX_BLOCKED', reason: 'Wallet not connected' })
        addEvent({ type:'tx_blocked', network:'local', detail:'Wallet not connected' })
        return
      }

      dispatch({ type: 'TX_SIGNING' })
      addEvent({ type:'tx_signing', network:'Polygon Amoy', detail:'Awaiting wallet signature' })

      const amounts: readonly bigint[] = rows.map(r => BigInt(Math.floor(r.payout * 1e6)))

      const hash = await writeContractAsync({
        address: treasuryRouter,
        abi: TREASURY_ROUTER_ABI,
        functionName: 'distribute',
        args: [recipientsList, amounts] as const
      })

      dispatch({ type: 'TX_SUBMITTED', hash: hash as string })
      addEvent({ type:'tx_submitted', tx: hash as Address, network:'Polygon Amoy', detail:'Transaction submitted' })
    } catch (e: any) {
      dispatch({ type: 'TX_FAILED', error: String(e?.message || e) })
      addEvent({ type:'tx_failed', network:'Polygon Amoy', detail:String(e?.message || e) })
    }
  }

  return <section className="sim-layout elite-sim">
    <div className="rt-card">
      <div className="system-pill">EXECUTION</div>
      <button className="primary" onClick={execute}>Execute Testnet Payout</button>
      <p>Wallet: {address || 'not connected'}</p>
      <p>Chain: {chainId}</p>
    </div>
  </section>
}
