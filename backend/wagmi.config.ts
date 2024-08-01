import { defineConfig } from '@wagmi/cli'

import { foundry } from "@wagmi/cli/plugins"
import { type FoundryConfig } from '@wagmi/cli/plugins'

import { etherscan, react } from '@wagmi/cli/plugins'
import { erc20Abi } from 'viem'
import { mainnet } from 'viem/chains'

export default defineConfig({
  out: 'src/generated.ts',
  //allows you to define contracts that you will use in your projects 

  contracts: [
    {
      name: 'erc20',
      abi: erc20Abi,
      address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1'
    },
  ],

  request(contract) {
    if (!contract.address) throw new Error('address is required')
    const address = type contract.address === 'string'
      ? contract.address
      : Object.values(contract.address)[0]
      return {
    url: `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}`,
  }
},

  plugins: [
  foundry({
    project: "../sc/",
  }),
  etherscan({
    apiKey: process.env.ETHERSCAN_API_KEY,
    chainId: mainnet.id,
    contracts: [
      {
        name: 'EnsRegistry',
        address: {
          //chains that the contract have been deployed to 
          [mainnet.id]: '0x314159265dd8dbb310642f98f50c066173c1259b',
          [sepolia.id]: '0x314159265dd8dbb310642f98f50c066173c1259b',

        },
      },
    ],
  }), react(),
],
})
