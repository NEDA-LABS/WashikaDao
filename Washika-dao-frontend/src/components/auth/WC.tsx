//import React from 'react';
//useActiveAccount,
import {ConnectButton, lightTheme, Theme, ThirdwebProvider} from "thirdweb/react";
import {createThirdwebClient, ThirdwebClient} from "thirdweb";
//add import for celo in prod too
//TODO: move to a separate component for better readability

import { arbitrumSepolia } from "thirdweb/chains";
export default function WC() {
  //@ts-ignore
  const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
  const client: ThirdwebClient = createThirdwebClient({clientId: _clientId});
  const chain = arbitrumSepolia;
  const customTheme: Theme = lightTheme({
    colors: {
      modalBg: "red",
    },
  });
  return (
    <ThirdwebProvider>
      <ConnectButton client={client} theme={customTheme} accountAbstraction={{ chain, sponsorGas: false }} />
    </ThirdwebProvider>
  );
}

/**
 * Creating a new wallet inAppWallet for each new user
 */
