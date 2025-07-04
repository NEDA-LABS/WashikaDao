import { createThirdwebClient, getContract } from "thirdweb";
import { celoAlfajoresTestnet } from "thirdweb/chains";
import WashikaDaoArtifact from "../abi/WashikaDao.json" with { type: "json" };

/**Reusable Blockchain Action Handlers */
// Full ABI type
export const WashikaDaoAbi = WashikaDaoArtifact.abi;

// FullDao Contract Object, correctly typed
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
export const client = createThirdwebClient({ clientId: _clientId });

// Create contract instance with proper Celo Alfajores address
export const FullDaoContract = getContract({
  client,
  chain: celoAlfajoresTestnet,
  address: "0x8EC4eE1A1aEccE5Df1a630ea50Aa9716549cE9Ff", // Celo Alfajores contract address
  abi: WashikaDaoArtifact.abi as any,
});

export const MSIG_RPC_URL = 'https://rpc.ankr.com/eth_sepolia'; 