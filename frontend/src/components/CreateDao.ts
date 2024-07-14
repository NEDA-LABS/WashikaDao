import { createWalletClient } from "viem";
import { celoAlfajores } from "viem/chains";

export default function createDao() {

  const client = createWalletClient({
    account,
    //passing chain is how viem knows to try serializing tx as cip42 
    chain: celoAlfajores,
    transport: http(),
  })

  client.writeContract({
    abi.CONTRACT_ABI,
    address: CONTRACT_ABI_ADDRESS,
    functionName: "contractMethod",
    args: [to, parseEther(value)],
    //set the fee currency on the contract write call 
    feeCurrency: FEE_CURRENCIES_ALFAJORES["cusd"]
  })

}
