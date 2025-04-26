import { createThirdwebClient, getContract } from "thirdweb";
import { celoAlfajoresTestnet } from "thirdweb/chains";
import WashikaDaoArtifact from "../abi/WashikaDao.json";
import type { Abi } from "abitype";

/**Reusable Blockchain Action Handlers */
//FullDao Contract Object
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
export const client = createThirdwebClient({ clientId: _clientId });
const WashikaDaoAbi = (WashikaDaoArtifact.abi as unknown) as Abi;
export const FullDaoContract = getContract({
  client,
  address: "0x52992bf84D4cEdae1d5b69155802dB107b2Ee8dD",
  chain: celoAlfajoresTestnet,
  abi: WashikaDaoAbi,
});
