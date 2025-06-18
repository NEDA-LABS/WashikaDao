import { AccountAddress, useActiveAccount } from "thirdweb/react"
import { createSafeClient } from '@safe-global/sdk-starter-kit'; 
import { useState } from "react";
// import type { EIP1193Provider } from "thirdweb/wallets";
//@eslint-ignore no-explicit-any
type EIP1193Provider = any; // Replace 'any' with the correct type if available from another package

/*
* Creating a 2 of 3 multisig 
*
*/
export default function CreateMultiSig() {
    const currUsrAcc = useActiveAccount();
    const [chairAddr, setChairAddr] = useState<typeof AccountAddress>();
    const [treasurerAddr, setTreasurerAddr] = useState<typeof AccountAddress>();
    const [creatorAddr, setCreatorAddr] = useState<typeof AccountAddress>();

    const SIGNER_ADDRESS_AS_PROVIDER: string | EIP1193Provider | undefined = currUsrAcc?.address; 
    // Getting the current signer object using thirdweb 
    const SIGNER_ADDR_AS_PRIVATE_KEY_AS_SIGNER =  currUsrAcc?.address;

const safeClient = async() =>  await createSafeClient ({
    provider: SIGNER_ADDRESS_AS_PROVIDER,
    signer: SIGNER_ADDR_AS_PRIVATE_KEY_AS_SIGNER,
    safeOptions: {
        owners: ['0x1','0x2','0x3'],
        threshold: 2
       // saltNonce: 123n
    }

})

    return (
        <div> 
            <h1>Create MultiSig</h1>
            
        </div>
    )
}
