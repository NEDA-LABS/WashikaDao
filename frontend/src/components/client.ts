import 'viem/window'
import { createWalletClient, custom } from 'viem'
import { mainnet, celo, celoAlfajores } from 'viem/chains'

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
