import React from "react";
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
