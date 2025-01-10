import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { FormData } from "../../pages/DaoRegistration";
import { useState } from "react";
export default function CreateDao(){
//Creating Dao using data from  DaoForm
const wallet = useActiveWallet();
console.log(wallet);//Cross Checking the wallet
//checking & grabbing the active account 
const activeAcc = useActiveAccount(); //str or undefined 
const [isUsrLoggedIn, setIsUsrLoggedIn] = useState<boolean>(false); 

}

