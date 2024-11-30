import {createThirdwebClient} from "thirdweb";

import { useActiveAccount } from "thirdweb/react";
import {celoAlfajoresTestnet} from "thirdweb/chains";
import { useWalletBalance} from "thirdweb/react";

//Account - Signs transactions
//Wallet - can be many, delegates signing to Account
//@ts-ignore
const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
const client = createThirdwebClient({ clientId: _clientId });
const chain = celoAlfajoresTestnet;

//Getting the account, it can sign transactions
export function GetUserAccount(){
    //Obtaining the account
    const usrAccount = useActiveAccount();
    console.log("account address is", usrAccount?.address);
    return usrAccount?.address;
}

export function GetUserBalance(){
    const accAddr = GetUserAccount();
    const userBalance = useWalletBalance({
        client,
        chain,
        address: accAddr,
    })
    return userBalance;
}