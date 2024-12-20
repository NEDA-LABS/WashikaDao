import { useState } from "react";
import { createThirdwebClient, getContract, prepareContractCall } from "thirdweb";
import { ConnectButton, ThirdwebProvider, useSetActiveWallet, useConnect, useActiveWallet, useDisconnect, lightTheme, useSendTransaction } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";
import { Account, inAppWallet, Wallet } from "thirdweb/wallets"; 
import { celoAlfajoresTestnet, arbitrumSepolia } from "thirdweb/chains";

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
  const client = createThirdwebClient({ clientId: _clientId });
export default function TestH3WebCreateDao(){
    const [currActiveAcc, setCurrActiveAcc] = useState<Account | undefined>(undefined);
    const [currActiveWall, setCurrActiveWall] = useState<Wallet | undefined>(undefined);
    const activeAccount = useActiveAccount();
    const activeWallet = useActiveWallet(); 
	//Using loading state for createDao Button will be extracted to be used in the form 
	const [isLoading, setIsLoading] = useState(false); 
	const [error, setError] = useState<string | null>(null);

    const urlToRedirectTo = "http://localhost:5173/userDashboard";//TODO: Change to point to MemberProfile Page

    function handleGetActiveAccount(){ 
        console.log("active account is", activeAccount?.address);
        setCurrActiveAcc(activeAccount);
    }

    function handleGetActiveWallet(): void { 
        setCurrActiveWall(activeWallet);
        console.log("Current Active wallet is", currActiveWall)
    }

        const wallets = [inAppWallet({
            auth: {
        mode: "popup", //options are "popup" | "redirect" | "window"
        options: ["email", "google", "phone"], //["discord", "google", "apple", "email", "phone", "farcaster"]
        redirectUrl: "http://localhost:5173/userDashboard"
                }
        })];
        const customTheme = lightTheme({
                    colors: {
                      primaryButtonBg: "#d0820c", // Background color for the button
                      primaryButtonText: "#fbfaf8", // Text color for the button
                    },
        });
    //TODO: switch to celoAlfajoresTestnet when in prod and mainnet when deployed
    const currInUseChain = arbitrumSepolia; 
    const testingAsMsig = 0x590Ab3FfA33644F1fDC648627Cd5eC937a271A20; 
    /** Sample Data for creating the Dao */
    const TESTER_WALLET_AS_MSIG = activeAccount;
    const _daoName: string =   "TestingName";
    const _location: string = "KenyaTesting";
    const _targetAudience: string = "TestingTarget";
    const _daoTitle: string = "TestingTitle";
    const _daoDescription: string = "Iamthedescripton";
    const _daoOverview: string = "Iamtheoverview";
    const _daoImageUrlHash: string = "Imtheurl";
    const _multiSigAddr:Account | undefined = TESTER_WALLET_AS_MSIG;
    const _multiSigPhoneNo  =  BigInt(724680615);

    /**function to create dao*/
    //Maybe get the Dao first 
    /**
     * Creates a Thirdweb contract by combining the Thirdweb client and contract options.
    @param options — The options for creating the contract.
    @returns — The Thirdweb contract.
     */
    const FullDaoContract = getContract({
        client,
        address: "0xe09115ed74F073E8610cFA7a4aC78a3ef5ac00ab",
        chain: arbitrumSepolia,
        abi: [{
			"inputs": [],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "multiSigAddr",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "daoDescription",
					"type": "string"
				}
			],
			"name": "DAOCREATED",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "_memberAddr",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "_email",
					"type": "string"
				},
				{
					"indexed": false,
					"internalType": "enum FullDaoContract.Role",
					"name": "_role",
					"type": "uint8"
				}
			],
			"name": "MEMBERADDED",
			"type": "event"
		},
		{
			"inputs": [],
			"name": "_generateRandomIds",
			"outputs": [
				{
					"internalType": "bytes32",
					"name": "",
					"type": "bytes32"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_memberName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_emailAddress",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "_phoneNumber",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_nationalId",
					"type": "uint256"
				},
				{
					"internalType": "enum FullDaoContract.Role",
					"name": "_role",
					"type": "uint8"
				},
				{
					"internalType": "address",
					"name": "_userAddress",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "_daoMultiSigAddr",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_multiSigPhoneNo",
					"type": "uint256"
				}
			],
			"name": "addMember",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_daoMultiSigAddr",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_pTitle",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_pSummary",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_pDescription",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "_duration",
					"type": "uint256"
				}
			],
			"name": "addProposal",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_daoMultiSigAddr",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_pTitle",
					"type": "string"
				},
				{
					"internalType": "bool",
					"name": "_voteType",
					"type": "bool"
				}
			],
			"name": "castVote",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_daoName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_location",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_targetAudience",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_daoTitle",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_daoDescription",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_daoOverview",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_daoImageUrlHash",
					"type": "string"
				},
				{
					"internalType": "address",
					"name": "_multiSigAddr",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_multiSigPhoneNo",
					"type": "uint256"
				}
			],
			"name": "createDao",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "daoList",
			"outputs": [
				{
					"internalType": "string",
					"name": "daoName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "location",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "targetAudience",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "daoTitle",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "daoDescription",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "daoOverview",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "daoImageUrlHash",
					"type": "string"
				},
				{
					"internalType": "address",
					"name": "multiSigAddr",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "multiSigPhoneNo",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "daoMultisigs",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_daoMultiSigAddr",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_pTitle",
					"type": "string"
				}
			],
			"name": "findProposalOwnerByTitle",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_multiSigAddr",
					"type": "address"
				}
			],
			"name": "getDaoByMultiSig",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string",
							"name": "daoName",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "location",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "targetAudience",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "daoTitle",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "daoDescription",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "daoOverview",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "daoImageUrlHash",
							"type": "string"
						},
						{
							"internalType": "address",
							"name": "multiSigAddr",
							"type": "address"
						},
						{
							"internalType": "uint256",
							"name": "multiSigPhoneNo",
							"type": "uint256"
						}
					],
					"internalType": "struct FullDaoContract.DaoDetails",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_daoMultiSigAddr",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_phoneNumber",
					"type": "uint256"
				}
			],
			"name": "getMemberByPhoneNumber",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string",
							"name": "memberName",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "emailAddress",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "phoneNumber",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "nationalId",
							"type": "uint256"
						},
						{
							"internalType": "enum FullDaoContract.Role",
							"name": "role",
							"type": "uint8"
						},
						{
							"internalType": "address",
							"name": "userAddress",
							"type": "address"
						},
						{
							"internalType": "address",
							"name": "daoMultiSigAddr",
							"type": "address"
						},
						{
							"internalType": "uint256",
							"name": "multiSigPhoneNo",
							"type": "uint256"
						}
					],
					"internalType": "struct FullDaoContract.MemberDetails",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_daoMultiSigAddr",
					"type": "address"
				}
			],
			"name": "getMemberCount",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_daoMultiSigAddr",
					"type": "address"
				}
			],
			"name": "getMembers",
			"outputs": [
				{
					"components": [
						{
							"internalType": "string",
							"name": "memberName",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "emailAddress",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "phoneNumber",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "nationalId",
							"type": "uint256"
						},
						{
							"internalType": "enum FullDaoContract.Role",
							"name": "role",
							"type": "uint8"
						},
						{
							"internalType": "address",
							"name": "userAddress",
							"type": "address"
						},
						{
							"internalType": "address",
							"name": "daoMultiSigAddr",
							"type": "address"
						},
						{
							"internalType": "uint256",
							"name": "multiSigPhoneNo",
							"type": "uint256"
						}
					],
					"internalType": "struct FullDaoContract.MemberDetails[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_multiSigAddr",
					"type": "address"
				}
			],
			"name": "getMsigToPhoneNumber",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_daoMultiSigAddr",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_pTitle",
					"type": "string"
				}
			],
			"name": "getProposalByTitle",
			"outputs": [
				{
					"components": [
						{
							"internalType": "address",
							"name": "pOwner",
							"type": "address"
						},
						{
							"internalType": "address",
							"name": "daoMultiSigAddr",
							"type": "address"
						},
						{
							"internalType": "string",
							"name": "pTitle",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "pSummary",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "pDescription",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "expirationTime",
							"type": "uint256"
						}
					],
					"internalType": "struct FullDaoContract.ProposalDetails",
					"name": "",
					"type": "tuple"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_daoMultiSigAddr",
					"type": "address"
				}
			],
			"name": "getProposals",
			"outputs": [
				{
					"components": [
						{
							"internalType": "address",
							"name": "pOwner",
							"type": "address"
						},
						{
							"internalType": "address",
							"name": "daoMultiSigAddr",
							"type": "address"
						},
						{
							"internalType": "string",
							"name": "pTitle",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "pSummary",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "pDescription",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "expirationTime",
							"type": "uint256"
						}
					],
					"internalType": "struct FullDaoContract.ProposalDetails[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_proposalOwner",
					"type": "address"
				}
			],
			"name": "getVotes",
			"outputs": [
				{
					"components": [
						{
							"internalType": "address",
							"name": "voterAddr",
							"type": "address"
						},
						{
							"internalType": "address",
							"name": "pOwner",
							"type": "address"
						},
						{
							"internalType": "bool",
							"name": "voteType",
							"type": "bool"
						}
					],
					"internalType": "struct FullDaoContract.VoteDetails[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_address",
					"type": "address"
				}
			],
			"name": "isAddrMultiSig",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_memberToCheck",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "_daoMultiSig",
					"type": "address"
				}
			],
			"name": "isDaoMember",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_phoneNumber",
					"type": "uint256"
				}
			],
			"name": "isPhoneNumberMappedToMsig",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_daoMultiSigAddr",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "index",
					"type": "uint256"
				}
			],
			"name": "isProposalExpired",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_daoMultiSigAddr",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "_pTitle",
					"type": "string"
				}
			],
			"name": "isProposalExpiredByTitle",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "memberDetails",
			"outputs": [
				{
					"internalType": "string",
					"name": "memberName",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "emailAddress",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "phoneNumber",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "nationalId",
					"type": "uint256"
				},
				{
					"internalType": "enum FullDaoContract.Role",
					"name": "role",
					"type": "uint8"
				},
				{
					"internalType": "address",
					"name": "userAddress",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "daoMultiSigAddr",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "multiSigPhoneNo",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "proposalDetailsList",
			"outputs": [
				{
					"internalType": "address",
					"name": "pOwner",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "daoMultiSigAddr",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "pTitle",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "pSummary",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "pDescription",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "expirationTime",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_multiSigAddr",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "_phoneNumber",
					"type": "uint256"
				}
			],
			"name": "setMsigToPhoneNumber",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "userRole",
			"outputs": [
				{
					"internalType": "enum FullDaoContract.Role",
					"name": "",
					"type": "uint8"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "voteDetailsList",
			"outputs": [
				{
					"internalType": "address",
					"name": "voterAddr",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "pOwner",
					"type": "address"
				},
				{
					"internalType": "bool",
					"name": "voteType",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}],
    });
    const { mutate: sendTx, data: transactionResult } = useSendTransaction(); 
    function handleCreateDao() {
		console.log("Initializing Dao Creation process, Running necessary checks first")
        if (!currActiveAcc?.address) {
            console.error("Fatal Error, No Active Account found");
            return;
        }
		console.log("ACtive Account found, check passed", currActiveAcc.address)
        //do the stuff to send the transaction to blockchain to create Dao 
		try {
        const createDaoTx = prepareContractCall({
            contract: FullDaoContract,
            method: "createDao",
            params: [_daoName, _location, _targetAudience, _daoTitle, _daoDescription, _daoOverview, _daoImageUrlHash, currActiveAcc.address, _multiSigPhoneNo],
        });
		console.log("Transaction prepared", createDaoTx)
		console.log("Initiating sending transaction to the blockchain")
        sendTx(createDaoTx as any);
        console.log("Transaction sent successfully");
        } catch (error: any) {
            if (error?.message?.includes("AA21")) {
                console.error("Gas sponsorship issue detected, user is low on gas");
            }
			console.error("Error in creating dao", error)
		}
        console.log("Current transaction result", transactionResult);
        
    }

    return (
        <>
            <ConnectButton 
             client={client} 
             theme={customTheme}
              accountAbstraction={{ chain: currInUseChain, sponsorGas: false }}
              wallets={wallets} /> 
        <button onClick={handleGetActiveAccount}>Get Active Account</button>
        <div>
            {currActiveAcc?.address}
        </div>
        <button onClick={handleGetActiveWallet}>Get Active Wallet</button>
        <div>
            {currActiveWall?.id}
        </div>
        <ul> 
            <li>{_daoName}</li>
            <li>{_location}</li>
            <li>{_targetAudience}</li>
            <li>{_daoTitle}</li>
            <li>{_daoDescription}</li>
            <li>{_daoOverview}</li>
            <li>{_daoImageUrlHash}</li>
        </ul>
        <button 
		onClick={handleCreateDao}
		disabled={isLoading || !currActiveAcc}
		>
		{isLoading ? 'Creating Dao...' : 'Click To Create Dao'}
		</button>
		{/**Show loading state */}
		      {isLoading && <div>Transaction in progress...</div>}
		{/**show error state */}
			{error && (
					<div style={{color: 'red'}}> 
					Error: {error} 
					</div>
			)}
			{/** Show transaction result if available */}
			{transactionResult && (
				<div> 
					Transaction Result: {JSON.stringify(transactionResult, null, 2)}
				</div>
			)}
        </>
    );
}
