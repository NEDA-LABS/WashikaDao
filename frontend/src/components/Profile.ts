/** 
 * Blockchain profile will involve, connect external wallet. 
 *TODO: Use phone number, name & email which phone no will be mapped to an address for non-custodial wallets. Social Connect will be used here
 */

//@actions: request user to connect wallet & get user accounts

import { createWalletClient } from "viem";
import { celo, celoAlfajores } from 'viem/chains';
import { injected } from "wagmi/connectors";

export default function Profile() {
  const walletClient = createWalletClient({
    chain: celo,
    //chain: celoAlfajores for testnet 
    transport: custom(window.ethereum),
  });
  const clientAddr = await walletClient.getAddresses();

  function checkForMinipay() {
    if (window.ethereum && window.ethereum.isMinipay)
      //User is using minipay wallet 
      connect({ connector: injected({ target: "metaMask" }) })
  }
}
