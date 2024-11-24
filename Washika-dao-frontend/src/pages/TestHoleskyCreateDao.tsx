import { ethers } from "ethers";
import { useState } from "react";
import { abi } from "../contractAbis/HoleskyFullDaoAbis";
import { Contract } from "ethers";

//TODO: Add its own page to allow for testing
export default function TestHoleskyCreateDao() {

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

  //Having the Data in variables for faster testing
  const TESTER_WALLET_AS_MSIG = userAddr;
  const _daoName: string =   "TestingName";
  const _location: string = "KenyaTesting";
  const _targetAudience: string = "TestingTa";
  const _daoTitle: string = "TestingTitle";
  const _daoDescription: string = "Iamthedescripton";
  const _daoOverview: string = "Iamtheoverview";
  const _daoImageUrlHash: string = "Imtheurl";
  const _multiSigAddr = TESTER_WALLET_AS_MSIG;
  const _multiSigPhoneNo  =  BigInt(724680615);

  async function handleCreateDao(){
    const provider = new ethers.BrowserProvider(window.ethereum, "any");
    let accounts = await provider.send("eth_requestAccounts", []);
    console.log(accounts)
    const signer = await  provider.getSigner();
      let holeskyFullDaoContract;
      holeskyFullDaoContract = new Contract("0xffd26D80A70DCC05E5b0FcD57B6C104e507f8b75", abi, signer);

    try {
    const tx = await holeskyFullDaoContract.createDao(
        _daoName,
        _location,
        _targetAudience,
        _daoTitle,
        _daoDescription,
        _daoOverview ,
        _daoImageUrlHash,
        _multiSigAddr,
        _multiSigPhoneNo
    )
    await tx.wait()
    setTxHash(tx.hash);
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
      <button onClick={handleCreateDao}>CreateDao</button>
      <h1>Transaction hash is: {txHash}</h1>
      </div>
  )
}
