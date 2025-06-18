// Component for Documentation, informational & illustrational purpose only, do not uncomment or try to reuse in production without relevant adjustments.
/**
import { ethers } from "ethers";
import { useState } from "react";
import { abi } from "../contractAbis/HoleskyFullDaoAbis";
import { Contract } from "ethers";

//Blockchain component
export default function TestHoleskyAddMember() {
  const [, setUsrBal] = useState(''); //Keeping track of bal of connected address
  const [userAddr, setUsrAddr] = useState('');//keeping track of curr connected address
  const [txHash, setTxHash] = useState('');//Keeping track of the transaction hash


 async function connect() {
    const provider = new ethers.BrowserProvider(window.ethereum, "any");
    let accounts = await provider.send("eth_requestAccounts", []);
    let account = accounts[0];
    console.log(account)
    provider.on('accountsChanged', function (accounts) {
        account = accounts[0];
        console.log(address); // Print new address
    });

    const signer = await  provider.getSigner();

    const address = await signer.getAddress();
    console.log(address);
   //@dev Keeping track of various stuff using hook
      setUsrAddr(address)
  //balance
  const balance = await provider.getBalance(address);
  const balanceInEth= ethers.formatEther(balance);
  setUsrBal(balanceInEth);
}

  const DAO_MSIG = "0x22a0C15ff1409936edA067b12B50B9dEbb7E4416"
  //Dummy Data instead of forms for testing
  const _memberName = "Luzaki";
  const _emailAddress = "luzaki007@gmail.com";
  const _phoneNumber = 724899222;
  const _nationalId = 12322;
  const _role = 1;
  const _userAddress = userAddr;
  const _daoMultiSigAddr = DAO_MSIG;
  const _multisigPhoneNo = BigInt(724680615);

  async function handleAddMemberToDao() {
        const provider = new ethers.BrowserProvider(window.ethereum, "any");
    let accounts = await provider.send("eth_requestAccounts", []);
    console.log(accounts)
    const signer = await  provider.getSigner();
      let holeskyFullDaoContract;
      holeskyFullDaoContract = new Contract("0xffd26D80A70DCC05E5b0FcD57B6C104e507f8b75", abi, signer);
     try {
          const tx = await holeskyFullDaoContract.addMember(
                _memberName,
                _emailAddress,
                _phoneNumber,
                _nationalId,
                _role,
                _userAddress,
                _daoMultiSigAddr,
                _multisigPhoneNo
      )
      await tx.wait();
      setTxHash(tx.hash);
    console.log(`Transaction successful: ${tx.hash}`)
         console.log(`Transaction successful: ${tx.hash}`)
  }  catch (error) {
    console.error("Transaction Failed with error", error);
    }
  }
    return (
      <div>
      <h1>Basic Connect</h1>
      <button onClick={connect}>LegacyConnect</button>
      <h2>CurrentConnectedAddress: {userAddr}</h2>
      <h2>CurrentBalance: {usrBal}</h2>
      <h1> Creating Dao Using the following Details </h1>
      <button onClick={handleAddMemberToDao}>AddMember</button>
      <h1>Transaction hash is: {txHash}</h1>
      </div>
  )
}
*/
