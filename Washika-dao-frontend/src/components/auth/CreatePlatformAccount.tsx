import ConnectWallet from "./ConnectWallet.js";

export default function CreatePlatformAccount(e: Event){
        e.preventDefault();
        ConnectWallet();

}