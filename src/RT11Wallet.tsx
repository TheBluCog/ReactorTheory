import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function RT11Wallet() {
  return <section className="glass-card" id="rt11-wallet">
    <p className="eyebrow">WALLET CONNECT</p>
    <h2>Connect wallet</h2>
    <p>Connect on Polygon or Polygon Amoy. Live payouts stay disabled until testnet validation and contract addresses are verified.</p>
    <div className="wallet-connect-wrap">
      <ConnectButton />
    </div>
  </section>
}
