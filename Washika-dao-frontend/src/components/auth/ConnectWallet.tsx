import { createThirdwebClient } from "thirdweb";
import {  ConnectButton, ThirdwebProvider } from "thirdweb/react";
import { lightTheme } from "thirdweb/react";

import { celoAlfajoresTestnet} from "thirdweb/chains";

export default function () {
//@ts-ignore
const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
var client = createThirdwebClient({ clientId: _clientId });
const customTheme = lightTheme({
  colors: {
    modalBg: "yellow",
  },
});
 const chain = celoAlfajoresTestnet;//TODO: Switch to mainnet when in prod
    return(
      <ThirdwebProvider>
      <ConnectButton client={client} theme={customTheme} accountAbstraction={{ chain, sponsorGas: false }} />
      </ThirdwebProvider>
    )
  }


