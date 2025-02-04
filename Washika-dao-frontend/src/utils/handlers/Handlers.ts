import { createThirdwebClient, getContract } from "thirdweb";
import { arbitrumSepolia } from "thirdweb/chains";
/**Reusable Blockchain Action Handlers */
//FullDao Contract Object
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const _clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
export const client = createThirdwebClient({ clientId: _clientId });
export const FullDaoContract = getContract({
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
                "type": "string"
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
                "type": "string"
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
                        "type": "string"
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
                        "type": "string"
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
                "type": "string"
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
                "type": "string"
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