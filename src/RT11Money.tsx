import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useEffect, useMemo, useState } from 'react'
import { TREASURY_ROUTER_ABI } from './contracts/treasuryRouter'
import { useTxFeed } from './hooks/useTxFeed'
import { contractExecutor } from './services/rt11/contractExecutor'
import { useRT11State } from './hooks/useRT11State'

type Address = `0x${string}`

export default function RT11Money() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const { addEvent } = useTxFeed()

  const [rt11State, dispatch] = useRT11State()

  const [amount] = useState(1000)
  const [txHash, setTxHash] = useState<Address | undefined>()

  const treasuryRouter = rt11State.treasuryRouter as Address

  // single source of truth
  const { data: receipt } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: !!txHash }
  })

  // receipt → state sync
  useEffect(() => {
    if (receipt && txHash && rt11State.status === 'TX_SUBMITTED') {
      dispatch({ type: 'TX_CONFIRMED' })

      addEvent({
        type: 'tx_confirmed',
        tx: txHash,
        network: 'Polygon Amoy',
        detail: 'Transaction confirmed on-chain'
      })
    }
  }, [receipt, txHash, rt11State.status])

  // payout rows (kept minimal but valid)
  const rows = useMemo(() => {
    return [] as { address: Address; payout: number }[]
  }, [amount])

  async function execute() {
    try {
      // execution lock (prevents double submit)
      if (rt11State.status === 'TX_SIGNING') return

      // basic guards
      if (!address) {
        dispatch({ type: 'TX_BLOCKED', reason: 'Wallet not connected' })
        addEvent({ type:'tx_blocked', network:'local', detail:'Wallet not connected' })
        return
      }

      if (treasuryRouter === '0x0000000000000000000000000000000000000000') {
        dispatch({ type: 'TX_BLOCKED', reason: 'Missing TreasuryRouter address' })
        addEvent({ type:'tx_blocked', network:'local', detail:'Missing TreasuryRouter address' })
        return
      }

      const recipientsList: readonly Address[] = rows.map(r => r.address)
      const amounts: readonly bigint[] = rows.map(r => BigInt(Math.floor(r.payout * 1e6)))

      // RT11 safety gates
      contractExecutor.validateAddresses(recipientsList)
      contractExecutor.verifyExecutionMode()

      dispatch({ type: 'TX_SIGNING' })

      const hash = await writeContractAsync({
        address: treasuryRouter,
        abi: TREASURY_ROUTER_ABI,
        functionName: 'distribute',
        args: [recipientsList, amounts] as const
      })

      setTxHash(hash as Address)

      dispatch({ type: 'TX_SUBMITTED', hash: hash as string })

      addEvent({
        type:'tx_submitted',
        tx: hash as Address,
        network:'Polygon Amoy',
        detail:'Transaction submitted'
      })

    } catch (e: any) {
      dispatch({ type: 'TX_FAILED', error: String(e?.message || e) })

      addEvent({
        type:'tx_failed',
        network:'Polygon Amoy',
        detail: String(e?.message || e)
      })
    }
  }

  return null
}
