import { useActiveWallet } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
export default function getCurrentConnectedAccount(){ 
    const activeWallet = useActiveWallet();
    if(activeWallet !== null || activeWallet !== undefined){
    return activeWallet;
    console.log(activeWallet);
    } 
    return null;

}

export function getCurrentConnectedAccount2(){
 const activeWallet = inAppWallet(); 
 console.log(activeWallet);
 return activeWallet; 

} 