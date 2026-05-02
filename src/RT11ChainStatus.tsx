import { useAccount, useBalance, useChainId } from 'wagmi'

const treasuryWallet = '0x27f780E6d46dF69347f954674bbDF39924e3D644' as const

export default function RT11ChainStatus() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: treasuryBalance } = useBalance({ address: treasuryWallet })
  const { data: walletBalance } = useBalance({ address })

  return <section className="glass-card" id="rt11-chain-status">
    <p className="eyebrow">LIVE CHAIN STATUS</p>
    <h2>Wallet + Treasury Read Layer</h2>
    <div className="result-grid">
      <div><span>Connected</span><strong>{isConnected ? 'Yes' : 'No'}</strong></div>
      <div><span>Chain ID</span><strong>{chainId || '—'}</strong></div>
      <div><span>Your Wallet</span><strong>{address ? `${address.slice(0,6)}…${address.slice(-4)}` : '—'}</strong></div>
      <div><span>Your Balance</span><strong>{walletBalance ? `${Number(walletBalance.formatted).toFixed(4)} ${walletBalance.symbol}` : '—'}</strong></div>
      <div><span>Treasury</span><strong>{`${treasuryWallet.slice(0,6)}…${treasuryWallet.slice(-4)}`}</strong></div>
      <div><span>Treasury Balance</span><strong>{treasuryBalance ? `${Number(treasuryBalance.formatted).toFixed(4)} ${treasuryBalance.symbol}` : '—'}</strong></div>
    </div>
    <p>Live payout execution remains disabled until Amoy testnet validation, allowlist, dry-run, and multisig approval are complete.</p>
  </section>
}
