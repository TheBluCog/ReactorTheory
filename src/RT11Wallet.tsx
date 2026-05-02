import { getDefaultConfig, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { polygon, polygonAmoy } from 'wagmi/chains'

const config = getDefaultConfig({
  appName: 'RT11',
  projectId: 'rt11-demo',
  chains: [polygon, polygonAmoy]
})

const queryClient = new QueryClient()

export default function RT11Wallet() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div style={{ padding: 20 }}>
            <h3>Connect Wallet</h3>
            <ConnectButton />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
