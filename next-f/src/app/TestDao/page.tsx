"use client";
// import { useActiveWallet } from "thirdweb/react";
import { Address } from "thirdweb";
import {   Web3Button } from "@thirdweb-dev/react";


const TESTER_WALLET_AS_MSIG: Address = "0x31D5F5a357B4a9AD0b9107DC84eA8Cf7D0D621E7";
const _daoName: string =   "TestingName";
const _location: string = "KenyaTesting";
const _targetAudience: string = "TestingTa";
const _daoTitle: string = "TestingTitle";
const _daoDescription: string = "Iamthedescripton";
const _daoOverview: string = "Iamtheoverview";
const _daoImageUrlHash: string = "Imtheurl";
const _multiSigAddr = TESTER_WALLET_AS_MSIG;
const _multiSigPhoneNo  =  BigInt(724680615);

const FULLDAO_CONTRACT_ADDRESS: Address = "0x50d92ea99af339519cd060c73d2db24620af2f57";

export default function TestDao(){


//  const { contract } = useContract(FULLDAO_CONTRACT_ADDRESS);
  
//  const { mutate, isLoading, error } =  useContractWrite(
//        contract,
//       "createDao",
//   );

  return (
  <>
  
      <Web3Button
        contractAddress={FULLDAO_CONTRACT_ADDRESS}
        action={(contract) => contract.call("createDao", [
             _daoName, _location, _targetAudience, _daoTitle, _daoDescription, _daoOverview, _daoImageUrlHash, _multiSigAddr, _multiSigPhoneNo,
         ])
         }>
        SendCreateDaoTransaction</Web3Button>

      {/* <button>I am a button</button> */}
  </>
  )
}


