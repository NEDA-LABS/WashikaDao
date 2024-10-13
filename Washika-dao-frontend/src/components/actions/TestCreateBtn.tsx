import { TransactionButton } from "thirdweb/react";
import { getContract, Address, prepareContractCall, createThirdwebClient } from "thirdweb";
import { useContract } from "@thirdweb-dev/react";
import { celoAlfajoresTestnet } from "thirdweb/chains";
import "

export default function TestCreateBtn() {
var TESTER_WALLET_AS_MSIG: Address = "0x31D5F5a357B4a9AD0b9107DC84eA8Cf7D0D621E7";

      //WARN:state variables placeholders for form data
 const _daoName: string =   "TestingName";
 const _location: string = "KenyaTesting";
 const _targetAudience: string = "TestingTa";
 const _daoTitle: string = "TestingTitle";
 const _daoDescription: string = "Iamthedescripton";
 const _daoOverview: string = "Iamtheoverview";
 const _daoImageUrlHash: string = "Imtheurl";
 const _multiSigAddr = TESTER_WALLET_AS_MSIG;
 const _multiSigPhoneNo  =  BigInt(724680615);

/** Configuration variables**/
 //@ts-ignore
const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
var client = createThirdwebClient ({ clientId: _clientId });
 const chain = celoAlfajoresTestnet;//TODO: Switch to mainnet when in prod

/**
 * @dev contract address on the celoAlfajoresTestnet
 * FullDaoContract
 */
const FULLDAO_CONTRACT_ADDRESS: Address = "0x50d92ea99af339519cd060c73d2db24620af2f57";
//const { contract } = useContract(FULLDAO_CONTRACT_ADDRESS);
  const daoContract = getContract({
      client,
      44787,

  })

    return (
      <TransactionButton
        transaction={() => {
          // Create a transaction object and return it
          const tx = prepareContractCall({
            contract,
            method: "createDao",
            params: [
                _daoName,
                _location,
                _targetAudience,
                _daoTitle,
                _daoDescription,
                _daoOverview,
                _daoImageUrlHash,
                _multiSigAddr,
                _multiSigPhoneNo,
            ],
          account,
          });
          return tx;
        }}
        onTransactionSent={(result) => {
          console.log("Transaction submitted", result.transactionHash);
        }}
        onTransactionConfirmed={(receipt) => {
          console.log("Transaction confirmed", receipt.transactionHash);
        }}
        onError={(error) => {
          console.error("Transaction error", error);
        }}
      >
        Confirm Transaction
      </TransactionButton>
    );
  }


