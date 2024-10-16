import { useActiveWallet } from "thirdweb/react";
import client from "../configurationsAndErrors/GlobalConfig";
import { Address, sendTransaction } from "thirdweb";
import { createDao } from "../../thirdweb/44787/0x50d92ea99af339519cd060c73d2db24620af2f57";
import { useContract, useContractWrite, Web3Button } from "@thirdweb-dev/react";
import { FDC_CAT_ABI } from "../../contractAbis/celoAlfajoresFullDaoContractAbi";

import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

export const TESTER_WALLET_AS_MSIG: Address = "0x31D5F5a357B4a9AD0b9107DC84eA8Cf7D0D621E7";

export default function CreateTestDao(){

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

 const { contract } = useContract(FULLDAO_CONTRACT_ADDRESS);

 const { mutate: sendTransaction } = useSendTransaction();

  const handleCreateDao = () => {
    const transaction = prepareContractCall ({
      contract,
      method: "function createDao(string _daoName, string _location, string _targetAudience, string _daoTitle, string _daoDescription, string _daoOverview, string _daoImageUrlHash, address _multiSigAddr, uint256 _multiSigPhoneNo)",
      params: [_daoName, _location, _targetAudience, _daoTitle, _daoDescription, _daoOverview, _daoImageUrlHash, _multiSigAddr, _multiSigPhoneNo]
});
         sendTransaction(transaction);
  }
  return (
  <>
      <button onClick={handleCreateDao}>Create A Dao</button>
 </>
  )
}


