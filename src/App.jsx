import { WagmiConfig, createConfig } from 'wagmi'
import { http } from 'viem'
import { mainnet } from 'viem/chains'
import { ConnectButton } from './components/ConnectButton'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  }
})

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ConnectButton />
      </WagmiConfig>
    </QueryClientProvider>
  )
}

export default App