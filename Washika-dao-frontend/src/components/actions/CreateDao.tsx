import { useActiveWallet } from "thirdweb/react";

export default function CreateDao(){
//Creating Dao using data from  DaoForm
const wallet = useActiveWallet();
console.log(wallet);//Cross Checking the wallet

}
