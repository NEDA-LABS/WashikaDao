import './App.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../config'

const queryClient = new QueryClient()

export default function App() {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={QueryClient}>
        {/**...*/}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

