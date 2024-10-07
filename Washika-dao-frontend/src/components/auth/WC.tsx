import { createThirdwebClient } from "thirdweb";
//useActiveAccount,
import { useActiveWallet, useActiveWalletConnectionStatus, ThirdwebProvider, ConnectButton, useConnectModal, useSetActiveWallet } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { lightTheme } from "thirdweb/react";
//add import for celo in prod too
import { celoAlfajoresTestnet} from "thirdweb/chains";
import { useEffect } from "react";

//isConnecting
const { connect} = useConnectModal();
const setActiveAccount = useSetActiveWallet();

/**
  * Place Button on Karibu Button, is user clicks, prompt to choose means to use to generate in app wallet, then log them in
  *
  */

//Add authentication using that one modal button to route to daoProfile using sample profile
//@ts-ignore
const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
const client = createThirdwebClient({ clientId: _clientId });
const customTheme = lightTheme({
  colors: {
    modalBg: "red",
  },
});
const wallets = [inAppWallet({
  auth: {
    options: [
      "email",
      "phone",
      "passkey",
      "google",
      "facebook",
      "apple",
      "telegram"
      // "discord",
      // "farcaster",
    ],
  },
}
)];
const chain = celoAlfajoresTestnet;//TODO: Switch to mainnet when in prod
// Get the connected smart account
//const smartAccount = useActiveAccount();

//subscribe to account change event
const currWallet = useActiveWallet();

const activeWallStatus = useActiveWalletConnectionStatus();


useEffect(() => {
  currWallet?.subscribe("accountChanged", (wall) => {
    console.log("Account changed:", wall);
  })
  currWallet?.subscribe("chainChanged", (chain) => {
    //TODO: switch to mainnet after testing is over
    if (chain.name !== 'celoAlfajoresTestnet') {
      alert("chain changed, please switch back to celo, dapp only exists on celo");
    }
  })
  async function plugUsrWall() {
    if (activeWallStatus === "disconnected") {
      alert("Please connect to a wallet to use application");
      //force component to render?
      //<WC />
      //useConnect();
      const wallet = await connect({ client }); //open the modal
      console.log(wallet);
    }
  }
  plugUsrWall();
  async function plugUsrAcc() {
    await setActiveAccount(wallets[0]);
  }
  plugUsrAcc();
}, [chain.name, currWallet]);

//TODO: move to a separate component for better readability


export default function WC() {
  return (
    <ThirdwebProvider>
      <ConnectButton client={client} theme={customTheme} accountAbstraction={{ chain, sponsorGas: false }} />
    </ThirdwebProvider>
  );
}

/**
 * Creating a new wallet inAppWallet for each new user
 */
