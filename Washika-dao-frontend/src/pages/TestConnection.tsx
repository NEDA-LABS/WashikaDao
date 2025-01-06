//import React from "react";
import {  useState } from "react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveWallet, lightTheme } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { Account, inAppWallet, Wallet } from "thirdweb/wallets";
import {arbitrumSepolia } from "thirdweb/chains";

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
  const client = createThirdwebClient({ clientId: _clientId });
  /**
 * A React component that establishes a connection to the Thirdweb client and manages
 * the active account and wallet state. It provides UI elements for connecting to a wallet
 * and displaying the current active account and wallet information.
 *
 * The component utilizes Thirdweb's `ConnectButton` to facilitate wallet connections
 * and uses hooks such as `useActiveAccount` and `useActiveWallet` to track the active
 * account and wallet. It also applies a custom theme to the `ConnectButton`.
 *
 * @remarks
 * - The component initializes a Thirdweb client using an environment variable for the client ID.
 * - It supports in-app wallet authentication with options for email, Google, and phone.
 * - The current chain in use is set to `arbitrumSepolia`, with a TODO note to switch to
 *   `celoAlfajoresTestnet` in production and mainnet when deployed.
 *
 * @component
 * @example
 * ```tsx
 * <TestConnection />
 * ```
 */
export default function TestConnection(){
    const [currActiveAcc, setCurrActiveAcc] = useState<Account | undefined>(undefined);
    const [currActiveWall, setCurrActiveWall] = useState<Wallet | undefined>(undefined);
    const activeAccount = useActiveAccount();
    const activeWallet = useActiveWallet();

//    const urlToRedirectTo = "http://localhost:5173/userDashboard";//TODO: Change to point to MemberProfile Page

    function handleGetActiveAccount(){
        console.log("active account is", activeAccount?.address);
        setCurrActiveAcc(activeAccount);
    }

    function handleGetActiveWallet(): void {
        setCurrActiveWall(activeWallet);
        console.log("Current Active wallet is", currActiveWall)
    }

        const wallets = [inAppWallet({
            auth: {
        mode: "popup", //options are "popup" | "redirect" | "window"
        options: ["email", "google", "phone"], //["discord", "google", "apple", "email", "phone", "farcaster"]
        redirectUrl: "http://localhost:5173/userDashboard"
                }
        })];
        const customTheme = lightTheme({
                    colors: {
                      primaryButtonBg: "#d0820c", // Background color for the button
                      primaryButtonText: "#fbfaf8", // Text color for the button
                    },
        });
    //TODO: switch to celoAlfajoresTestnet when in prod and mainnet when deployed
    const currInUseChain = arbitrumSepolia;
    return (
        <div>
            <ConnectButton
             client={client}
             theme={customTheme}
              accountAbstraction={{ chain: currInUseChain, sponsorGas: false }}
              wallets={wallets} />
        <button onClick={handleGetActiveAccount}>Get Active Account</button>
        <div>
            {currActiveAcc?.address}
        </div>
        <button onClick={handleGetActiveWallet}>Get Active Wallet</button>
        <div>
            {currActiveWall?.id}
        </div>
        </div>
    );
}
