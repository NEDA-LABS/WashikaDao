import 'viem/window'
import { createWalletClient, createPublicClient, custom, http } from 'viem'
import { mainnet, celo, celoAlfajores } from 'viem/chains'
import { EthereumProvider } from '@walletconnect/ethereum-provider'

//TODO: Refactor during UX Optimization stage 
export async function getAddr() {
  const [userAddr] = await window.ethereum.request({
    method: 'eth_requestAccounts'
  })
  return userAddr;
}

export const walletClient = createWalletClient({
  account: await getAddr(),
  chain: mainnet, //change chains accordingly 
  transport: custom(window.ethereum!),
})

export const publicClient = createPublicClient({
  chain: mainnet,  //TODO: Add alt chains
  transport: http(),
})


//wallet provider i.e wallet connect 
//TODO: Refactor to add minipay and perform minipay checks here 
export const provider = await EthereumProvider.init({
  projectId: "project_id_from_wc_goes_here",
  showQrModal: true,
  chains: [1],
})

export const walletClientWC = createWalletClient({
  chain: mainnet,
  transport: custom(provider),
})
