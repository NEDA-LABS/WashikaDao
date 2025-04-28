//import React from "react";
import { createThirdwebClient } from "thirdweb";
import {ConnectButton } from "thirdweb/react";
import { lightTheme } from "thirdweb/react";
//import { arbitrumSepolia, celoAlfajoresTestnet } from "thirdweb/chains";
import { celoAlfajoresTestnet} from "thirdweb/chains";
import { createWallet, inAppWallet } from "thirdweb/wallets";
/**
 *
 * Connect Wallet Component is from thirdweb & is responsible for the modal for plugging in in app wallet functionality
 */
//WARN!!:DO NOT TOUCH COMPONENT IN USE

export default function ConnectWallet() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
  const client = createThirdwebClient({ clientId: _clientId });


  const wallets = [
    inAppWallet({
    auth: {
      mode: "popup", //options are "popup" | "redirect" | "window"
      options: ["email", "google", "phone", "passkey", "facebook", "apple"]
    //redirectUrl:"desiredredirectlocation"
    }
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet")
]

  const customTheme = lightTheme({
    colors: {
      primaryButtonBg: "#d0820c", // Background color for the button
      primaryButtonText: "#fbfaf8", // Text color for the button
    },
  });
  const chain = celoAlfajoresTestnet; // Changing wallet
  //TODO: Switch to celo mainnet when in prod
  return (
    <div className="connectButton">
      <ConnectButton
        client={client}
        theme={customTheme}
        accountAbstraction={{ chain, sponsorGas: false }}
        wallets={wallets}
      />
    </div>
  );
}
