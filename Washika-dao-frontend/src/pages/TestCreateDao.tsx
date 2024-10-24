import { Address, getContract, prepareContractCall, createThirdwebClient } from "thirdweb"
import { celoAlfajoresTestnet } from "thirdweb/chains";
import {  useSendTransaction } from "thirdweb/react";



export default function TestCreateDao() {
   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
  const client = createThirdwebClient({ clientId: _clientId });

  const { mutate: sendTransaction, data: transactionResult } = useSendTransaction();

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
  //const FULLDAO_CONTRACT_ADDRESS: Address = "0x50d92ea99af339519cd060c73d2db24620af2f57";

 // const { contract } = useContract(FULLDAO_CONTRACT_ADDRESS);
  const contract = getContract({
      client,
      chain: celoAlfajoresTestnet,
      address: "0x50d92eA99AF339519Cd060c73d2DB24620AF2f57"
  })

  const handleCreateDaoBtn = () => {
    const transaction = prepareContractCall({
      contract,
      method: "function createDao(string _daoName, string _location, string _targetAudience, string _daoTitle, string _daoDescription, string _daoOverview, string _daoImageUrlHash, address _multiSigAddr, uint256 _multiSigPhoneNo)",
      params: [_daoName, _location, _targetAudience, _daoTitle, _daoDescription, _daoOverview, _daoImageUrlHash, _multiSigAddr, _multiSigPhoneNo]
    });
      console.log(transaction);
    sendTransaction(transaction);

    console.log(transactionResult);

  }
    return (
  <div>
    <h1> I test dao creation before button integration</h1>
        <button onClick={handleCreateDaoBtn}>Click to Create Sample Dao</button>
  </div>
  )
}
