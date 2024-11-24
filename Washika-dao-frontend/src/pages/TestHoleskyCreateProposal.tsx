import { ethers } from "ethers";
import { useState } from "react";
import { abi } from "../contractAbis/HoleskyFullDaoAbis";
import { Contract } from "ethers";

export default function TestHoleskyCreateProposal() {
  const [usrBal, setUsrBal] = useState(''); //Keeping track of bal of connected address
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
  //Dummy Data Instead of forms for testing
  const _daoMultiSigAddr = DAO_MSIG;
  const _pTitle = "GenesisProposal";
  const _pSummary = "GenesisSummary";
  const _pDescription = "GenesisDescription";
  const _duration = 5;//TODO: Check client impl with blockchain to ensure enough time to cast vote & quorom, blockchain will add function for this in V2

  async function handleCreateProposal() {
       const provider = new ethers.BrowserProvider(window.ethereum, "any");
    let accounts = await provider.send("eth_requestAccounts", []);
    console.log(accounts)
    const signer = await  provider.getSigner();
      let holeskyFullDaoContract;
      holeskyFullDaoContract = new Contract("0xffd26D80A70DCC05E5b0FcD57B6C104e507f8b75", abi, signer);

    try {
          const tx = await holeskyFullDaoContract.addProposal(
                          _daoMultiSigAddr,
                          _pTitle,
                          _pSummary,
                          _pDescription,
                          _duration
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
      <h1> Creating Proposal  Using the following Details </h1>
      <button onClick={handleCreateProposal}>CreateProposal</button>
      <h1>Transaction hash is: {txHash}</h1>
      </div>
  )


}
