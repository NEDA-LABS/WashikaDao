import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, alfajores, celo } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia, alfajores, celo],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [alfajores.id]: http(),
    [celo.id]: http(),
  },
})
