import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { lightTheme } from "thirdweb/react";
import { celoAlfajoresTestnet } from "thirdweb/chains";
//WARN:: DO NOT TOUCH COMPONENT IN USE
export default function ConnectWallet() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
  const client = createThirdwebClient({ clientId: _clientId });
  const customTheme = lightTheme({
    colors: {
      modalBg: "yellow",
    },
  });
  const chain = celoAlfajoresTestnet;
  //TODO: Switch to mainnet when in prod
  return (
    <ConnectButton
      client={client}
      theme={customTheme}
      accountAbstraction={{ chain, sponsorGas: false }}
    />
  );
}
