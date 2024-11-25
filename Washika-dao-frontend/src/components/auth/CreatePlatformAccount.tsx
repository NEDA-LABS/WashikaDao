import ConnectWallet from "./ConnectWallet.tsx";

export default function CreatePlatformAccount(e: Event){
        e.preventDefault();
        ConnectWallet();

}