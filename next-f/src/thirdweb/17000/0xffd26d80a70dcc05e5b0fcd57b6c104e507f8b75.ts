import {
  prepareEvent,
  prepareContractCall,
  readContract,
  type BaseTransactionOptions,
  type AbiParameterToPrimitiveType,
} from "thirdweb";

/**
* Contract events
*/

/**
 * Represents the filters for the "DAOCREATED" event.
 */
export type DAOCREATEDEventFilters = Partial<{
  multiSigAddr: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"multiSigAddr","type":"address"}>
}>;

/**
 * Creates an event object for the DAOCREATED event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { dAOCREATEDEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  dAOCREATEDEvent({
 *  multiSigAddr: ...,
 * })
 * ],
 * });
 * ```
 */
export function dAOCREATEDEvent(filters: DAOCREATEDEventFilters = {}) {
  return prepareEvent({
    signature: "event DAOCREATED(address indexed multiSigAddr, string name, string daoDescription)",
    filters,
  });
};
  

/**
 * Represents the filters for the "MEMBERADDED" event.
 */
export type MEMBERADDEDEventFilters = Partial<{
  _memberAddr: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"_memberAddr","type":"address"}>
}>;

/**
 * Creates an event object for the MEMBERADDED event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { mEMBERADDEDEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  mEMBERADDEDEvent({
 *  _memberAddr: ...,
 * })
 * ],
 * });
 * ```
 */
export function mEMBERADDEDEvent(filters: MEMBERADDEDEventFilters = {}) {
  return prepareEvent({
    signature: "event MEMBERADDED(address indexed _memberAddr, string _email, uint8 _role)",
    filters,
  });
};
  

/**
* Contract read functions
*/



/**
 * Calls the "_generateRandomIds" function on the contract.
 * @param options - The options for the _generateRandomIds function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { _generateRandomIds } from "TODO";
 *
 * const result = await _generateRandomIds();
 *
 * ```
 */
export async function _generateRandomIds(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x12168863",
  [],
  [
    {
      "internalType": "bytes32",
      "name": "",
      "type": "bytes32"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "daoList" function.
 */
export type DaoListParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "daoList" function on the contract.
 * @param options - The options for the daoList function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { daoList } from "TODO";
 *
 * const result = await daoList({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function daoList(
  options: BaseTransactionOptions<DaoListParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x37dd27f8",
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  [
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
  ]
],
    params: [options.arg_0]
  });
};


/**
 * Represents the parameters for the "daoMultisigs" function.
 */
export type DaoMultisigsParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "daoMultisigs" function on the contract.
 * @param options - The options for the daoMultisigs function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { daoMultisigs } from "TODO";
 *
 * const result = await daoMultisigs({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function daoMultisigs(
  options: BaseTransactionOptions<DaoMultisigsParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x3846b9c0",
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ]
],
    params: [options.arg_0]
  });
};


/**
 * Represents the parameters for the "findProposalOwnerByTitle" function.
 */
export type FindProposalOwnerByTitleParams = {
  daoMultiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_daoMultiSigAddr","type":"address"}>
pTitle: AbiParameterToPrimitiveType<{"internalType":"string","name":"_pTitle","type":"string"}>
};

/**
 * Calls the "findProposalOwnerByTitle" function on the contract.
 * @param options - The options for the findProposalOwnerByTitle function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { findProposalOwnerByTitle } from "TODO";
 *
 * const result = await findProposalOwnerByTitle({
 *  daoMultiSigAddr: ...,
 *  pTitle: ...,
 * });
 *
 * ```
 */
export async function findProposalOwnerByTitle(
  options: BaseTransactionOptions<FindProposalOwnerByTitleParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x5f8cf286",
  [
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
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ]
],
    params: [options.daoMultiSigAddr, options.pTitle]
  });
};


/**
 * Represents the parameters for the "getDaoByMultiSig" function.
 */
export type GetDaoByMultiSigParams = {
  multiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_multiSigAddr","type":"address"}>
};

/**
 * Calls the "getDaoByMultiSig" function on the contract.
 * @param options - The options for the getDaoByMultiSig function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getDaoByMultiSig } from "TODO";
 *
 * const result = await getDaoByMultiSig({
 *  multiSigAddr: ...,
 * });
 *
 * ```
 */
export async function getDaoByMultiSig(
  options: BaseTransactionOptions<GetDaoByMultiSigParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xe9a37895",
  [
    {
      "internalType": "address",
      "name": "_multiSigAddr",
      "type": "address"
    }
  ],
  [
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
  ]
],
    params: [options.multiSigAddr]
  });
};


/**
 * Represents the parameters for the "getMemberCount" function.
 */
export type GetMemberCountParams = {
  daoMultiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_daoMultiSigAddr","type":"address"}>
};

/**
 * Calls the "getMemberCount" function on the contract.
 * @param options - The options for the getMemberCount function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getMemberCount } from "TODO";
 *
 * const result = await getMemberCount({
 *  daoMultiSigAddr: ...,
 * });
 *
 * ```
 */
export async function getMemberCount(
  options: BaseTransactionOptions<GetMemberCountParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xcb896e4f",
  [
    {
      "internalType": "address",
      "name": "_daoMultiSigAddr",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.daoMultiSigAddr]
  });
};


/**
 * Represents the parameters for the "getMembers" function.
 */
export type GetMembersParams = {
  daoMultiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_daoMultiSigAddr","type":"address"}>
};

/**
 * Calls the "getMembers" function on the contract.
 * @param options - The options for the getMembers function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getMembers } from "TODO";
 *
 * const result = await getMembers({
 *  daoMultiSigAddr: ...,
 * });
 *
 * ```
 */
export async function getMembers(
  options: BaseTransactionOptions<GetMembersParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x78544629",
  [
    {
      "internalType": "address",
      "name": "_daoMultiSigAddr",
      "type": "address"
    }
  ],
  [
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
  ]
],
    params: [options.daoMultiSigAddr]
  });
};


/**
 * Represents the parameters for the "getMsigToPhoneNumber" function.
 */
export type GetMsigToPhoneNumberParams = {
  multiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_multiSigAddr","type":"address"}>
};

/**
 * Calls the "getMsigToPhoneNumber" function on the contract.
 * @param options - The options for the getMsigToPhoneNumber function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getMsigToPhoneNumber } from "TODO";
 *
 * const result = await getMsigToPhoneNumber({
 *  multiSigAddr: ...,
 * });
 *
 * ```
 */
export async function getMsigToPhoneNumber(
  options: BaseTransactionOptions<GetMsigToPhoneNumberParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xfe5eceb8",
  [
    {
      "internalType": "address",
      "name": "_multiSigAddr",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.multiSigAddr]
  });
};


/**
 * Represents the parameters for the "getProposalByTitle" function.
 */
export type GetProposalByTitleParams = {
  daoMultiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_daoMultiSigAddr","type":"address"}>
pTitle: AbiParameterToPrimitiveType<{"internalType":"string","name":"_pTitle","type":"string"}>
};

/**
 * Calls the "getProposalByTitle" function on the contract.
 * @param options - The options for the getProposalByTitle function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getProposalByTitle } from "TODO";
 *
 * const result = await getProposalByTitle({
 *  daoMultiSigAddr: ...,
 *  pTitle: ...,
 * });
 *
 * ```
 */
export async function getProposalByTitle(
  options: BaseTransactionOptions<GetProposalByTitleParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x1c550b25",
  [
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
  [
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
  ]
],
    params: [options.daoMultiSigAddr, options.pTitle]
  });
};


/**
 * Represents the parameters for the "getProposals" function.
 */
export type GetProposalsParams = {
  daoMultiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_daoMultiSigAddr","type":"address"}>
};

/**
 * Calls the "getProposals" function on the contract.
 * @param options - The options for the getProposals function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getProposals } from "TODO";
 *
 * const result = await getProposals({
 *  daoMultiSigAddr: ...,
 * });
 *
 * ```
 */
export async function getProposals(
  options: BaseTransactionOptions<GetProposalsParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x7991502e",
  [
    {
      "internalType": "address",
      "name": "_daoMultiSigAddr",
      "type": "address"
    }
  ],
  [
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
  ]
],
    params: [options.daoMultiSigAddr]
  });
};


/**
 * Represents the parameters for the "getVotes" function.
 */
export type GetVotesParams = {
  proposalOwner: AbiParameterToPrimitiveType<{"internalType":"address","name":"_proposalOwner","type":"address"}>
};

/**
 * Calls the "getVotes" function on the contract.
 * @param options - The options for the getVotes function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getVotes } from "TODO";
 *
 * const result = await getVotes({
 *  proposalOwner: ...,
 * });
 *
 * ```
 */
export async function getVotes(
  options: BaseTransactionOptions<GetVotesParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x9ab24eb0",
  [
    {
      "internalType": "address",
      "name": "_proposalOwner",
      "type": "address"
    }
  ],
  [
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
  ]
],
    params: [options.proposalOwner]
  });
};


/**
 * Represents the parameters for the "isAddrMultiSig" function.
 */
export type IsAddrMultiSigParams = {
  address: AbiParameterToPrimitiveType<{"internalType":"address","name":"_address","type":"address"}>
};

/**
 * Calls the "isAddrMultiSig" function on the contract.
 * @param options - The options for the isAddrMultiSig function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isAddrMultiSig } from "TODO";
 *
 * const result = await isAddrMultiSig({
 *  address: ...,
 * });
 *
 * ```
 */
export async function isAddrMultiSig(
  options: BaseTransactionOptions<IsAddrMultiSigParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x881d9096",
  [
    {
      "internalType": "address",
      "name": "_address",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.address]
  });
};


/**
 * Represents the parameters for the "isDaoMember" function.
 */
export type IsDaoMemberParams = {
  memberToCheck: AbiParameterToPrimitiveType<{"internalType":"address","name":"_memberToCheck","type":"address"}>
daoMultiSig: AbiParameterToPrimitiveType<{"internalType":"address","name":"_daoMultiSig","type":"address"}>
};

/**
 * Calls the "isDaoMember" function on the contract.
 * @param options - The options for the isDaoMember function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isDaoMember } from "TODO";
 *
 * const result = await isDaoMember({
 *  memberToCheck: ...,
 *  daoMultiSig: ...,
 * });
 *
 * ```
 */
export async function isDaoMember(
  options: BaseTransactionOptions<IsDaoMemberParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xc4991422",
  [
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
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.memberToCheck, options.daoMultiSig]
  });
};


/**
 * Represents the parameters for the "isPhoneNumberMappedToMsig" function.
 */
export type IsPhoneNumberMappedToMsigParams = {
  phoneNumber: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_phoneNumber","type":"uint256"}>
};

/**
 * Calls the "isPhoneNumberMappedToMsig" function on the contract.
 * @param options - The options for the isPhoneNumberMappedToMsig function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isPhoneNumberMappedToMsig } from "TODO";
 *
 * const result = await isPhoneNumberMappedToMsig({
 *  phoneNumber: ...,
 * });
 *
 * ```
 */
export async function isPhoneNumberMappedToMsig(
  options: BaseTransactionOptions<IsPhoneNumberMappedToMsigParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xf49a5d89",
  [
    {
      "internalType": "uint256",
      "name": "_phoneNumber",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.phoneNumber]
  });
};


/**
 * Represents the parameters for the "isProposalExpired" function.
 */
export type IsProposalExpiredParams = {
  daoMultiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_daoMultiSigAddr","type":"address"}>
index: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"index","type":"uint256"}>
};

/**
 * Calls the "isProposalExpired" function on the contract.
 * @param options - The options for the isProposalExpired function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isProposalExpired } from "TODO";
 *
 * const result = await isProposalExpired({
 *  daoMultiSigAddr: ...,
 *  index: ...,
 * });
 *
 * ```
 */
export async function isProposalExpired(
  options: BaseTransactionOptions<IsProposalExpiredParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xfab5c7f0",
  [
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
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.daoMultiSigAddr, options.index]
  });
};


/**
 * Represents the parameters for the "isProposalExpiredByTitle" function.
 */
export type IsProposalExpiredByTitleParams = {
  daoMultiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_daoMultiSigAddr","type":"address"}>
pTitle: AbiParameterToPrimitiveType<{"internalType":"string","name":"_pTitle","type":"string"}>
};

/**
 * Calls the "isProposalExpiredByTitle" function on the contract.
 * @param options - The options for the isProposalExpiredByTitle function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isProposalExpiredByTitle } from "TODO";
 *
 * const result = await isProposalExpiredByTitle({
 *  daoMultiSigAddr: ...,
 *  pTitle: ...,
 * });
 *
 * ```
 */
export async function isProposalExpiredByTitle(
  options: BaseTransactionOptions<IsProposalExpiredByTitleParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xadb21544",
  [
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
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.daoMultiSigAddr, options.pTitle]
  });
};


/**
 * Represents the parameters for the "memberDetails" function.
 */
export type MemberDetailsParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "memberDetails" function on the contract.
 * @param options - The options for the memberDetails function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { memberDetails } from "TODO";
 *
 * const result = await memberDetails({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function memberDetails(
  options: BaseTransactionOptions<MemberDetailsParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x74afc4db",
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  [
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
  ]
],
    params: [options.arg_0]
  });
};


/**
 * Represents the parameters for the "proposalDetailsList" function.
 */
export type ProposalDetailsListParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "proposalDetailsList" function on the contract.
 * @param options - The options for the proposalDetailsList function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { proposalDetailsList } from "TODO";
 *
 * const result = await proposalDetailsList({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function proposalDetailsList(
  options: BaseTransactionOptions<ProposalDetailsListParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x25e73075",
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  [
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
  ]
],
    params: [options.arg_0]
  });
};




/**
 * Calls the "userRole" function on the contract.
 * @param options - The options for the userRole function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { userRole } from "TODO";
 *
 * const result = await userRole();
 *
 * ```
 */
export async function userRole(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x01b70162",
  [],
  [
    {
      "internalType": "enum FullDaoContract.Role",
      "name": "",
      "type": "uint8"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "voteDetailsList" function.
 */
export type VoteDetailsListParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "voteDetailsList" function on the contract.
 * @param options - The options for the voteDetailsList function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { voteDetailsList } from "TODO";
 *
 * const result = await voteDetailsList({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function voteDetailsList(
  options: BaseTransactionOptions<VoteDetailsListParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x018b9b24",
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  [
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
  ]
],
    params: [options.arg_0]
  });
};


/**
* Contract write functions
*/

/**
 * Represents the parameters for the "addMember" function.
 */
export type AddMemberParams = {
  memberName: AbiParameterToPrimitiveType<{"internalType":"string","name":"_memberName","type":"string"}>
emailAddress: AbiParameterToPrimitiveType<{"internalType":"string","name":"_emailAddress","type":"string"}>
phoneNumber: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_phoneNumber","type":"uint256"}>
nationalId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_nationalId","type":"uint256"}>
role: AbiParameterToPrimitiveType<{"internalType":"enum FullDaoContract.Role","name":"_role","type":"uint8"}>
userAddress: AbiParameterToPrimitiveType<{"internalType":"address","name":"_userAddress","type":"address"}>
daoMultiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_daoMultiSigAddr","type":"address"}>
multiSigPhoneNo: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_multiSigPhoneNo","type":"uint256"}>
};

/**
 * Calls the "addMember" function on the contract.
 * @param options - The options for the "addMember" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { addMember } from "TODO";
 *
 * const transaction = addMember({
 *  memberName: ...,
 *  emailAddress: ...,
 *  phoneNumber: ...,
 *  nationalId: ...,
 *  role: ...,
 *  userAddress: ...,
 *  daoMultiSigAddr: ...,
 *  multiSigPhoneNo: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function addMember(
  options: BaseTransactionOptions<AddMemberParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x7da200c6",
  [
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
  []
],
    params: [options.memberName, options.emailAddress, options.phoneNumber, options.nationalId, options.role, options.userAddress, options.daoMultiSigAddr, options.multiSigPhoneNo]
  });
};


/**
 * Represents the parameters for the "addProposal" function.
 */
export type AddProposalParams = {
  daoMultiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_daoMultiSigAddr","type":"address"}>
pTitle: AbiParameterToPrimitiveType<{"internalType":"string","name":"_pTitle","type":"string"}>
pSummary: AbiParameterToPrimitiveType<{"internalType":"string","name":"_pSummary","type":"string"}>
pDescription: AbiParameterToPrimitiveType<{"internalType":"string","name":"_pDescription","type":"string"}>
duration: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_duration","type":"uint256"}>
};

/**
 * Calls the "addProposal" function on the contract.
 * @param options - The options for the "addProposal" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { addProposal } from "TODO";
 *
 * const transaction = addProposal({
 *  daoMultiSigAddr: ...,
 *  pTitle: ...,
 *  pSummary: ...,
 *  pDescription: ...,
 *  duration: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function addProposal(
  options: BaseTransactionOptions<AddProposalParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x39b98ee3",
  [
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
  []
],
    params: [options.daoMultiSigAddr, options.pTitle, options.pSummary, options.pDescription, options.duration]
  });
};


/**
 * Represents the parameters for the "castVote" function.
 */
export type CastVoteParams = {
  daoMultiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_daoMultiSigAddr","type":"address"}>
pTitle: AbiParameterToPrimitiveType<{"internalType":"string","name":"_pTitle","type":"string"}>
voteType: AbiParameterToPrimitiveType<{"internalType":"bool","name":"_voteType","type":"bool"}>
};

/**
 * Calls the "castVote" function on the contract.
 * @param options - The options for the "castVote" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { castVote } from "TODO";
 *
 * const transaction = castVote({
 *  daoMultiSigAddr: ...,
 *  pTitle: ...,
 *  voteType: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function castVote(
  options: BaseTransactionOptions<CastVoteParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x65d3a30c",
  [
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
  []
],
    params: [options.daoMultiSigAddr, options.pTitle, options.voteType]
  });
};


/**
 * Represents the parameters for the "createDao" function.
 */
export type CreateDaoParams = {
  daoName: AbiParameterToPrimitiveType<{"internalType":"string","name":"_daoName","type":"string"}>
location: AbiParameterToPrimitiveType<{"internalType":"string","name":"_location","type":"string"}>
targetAudience: AbiParameterToPrimitiveType<{"internalType":"string","name":"_targetAudience","type":"string"}>
daoTitle: AbiParameterToPrimitiveType<{"internalType":"string","name":"_daoTitle","type":"string"}>
daoDescription: AbiParameterToPrimitiveType<{"internalType":"string","name":"_daoDescription","type":"string"}>
daoOverview: AbiParameterToPrimitiveType<{"internalType":"string","name":"_daoOverview","type":"string"}>
daoImageUrlHash: AbiParameterToPrimitiveType<{"internalType":"string","name":"_daoImageUrlHash","type":"string"}>
multiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_multiSigAddr","type":"address"}>
multiSigPhoneNo: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_multiSigPhoneNo","type":"uint256"}>
};

/**
 * Calls the "createDao" function on the contract.
 * @param options - The options for the "createDao" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { createDao } from "TODO";
 *
 * const transaction = createDao({
 *  daoName: ...,
 *  location: ...,
 *  targetAudience: ...,
 *  daoTitle: ...,
 *  daoDescription: ...,
 *  daoOverview: ...,
 *  daoImageUrlHash: ...,
 *  multiSigAddr: ...,
 *  multiSigPhoneNo: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createDao(
  options: BaseTransactionOptions<CreateDaoParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x15190964",
  [
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
  []
],
    params: [options.daoName, options.location, options.targetAudience, options.daoTitle, options.daoDescription, options.daoOverview, options.daoImageUrlHash, options.multiSigAddr, options.multiSigPhoneNo]
  });
};


/**
 * Represents the parameters for the "getMemberByPhoneNumber" function.
 */
export type GetMemberByPhoneNumberParams = {
  daoMultiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_daoMultiSigAddr","type":"address"}>
phoneNumber: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_phoneNumber","type":"uint256"}>
};

/**
 * Calls the "getMemberByPhoneNumber" function on the contract.
 * @param options - The options for the "getMemberByPhoneNumber" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { getMemberByPhoneNumber } from "TODO";
 *
 * const transaction = getMemberByPhoneNumber({
 *  daoMultiSigAddr: ...,
 *  phoneNumber: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function getMemberByPhoneNumber(
  options: BaseTransactionOptions<GetMemberByPhoneNumberParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x80806501",
  [
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
  [
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
  ]
],
    params: [options.daoMultiSigAddr, options.phoneNumber]
  });
};


/**
 * Represents the parameters for the "setMsigToPhoneNumber" function.
 */
export type SetMsigToPhoneNumberParams = {
  multiSigAddr: AbiParameterToPrimitiveType<{"internalType":"address","name":"_multiSigAddr","type":"address"}>
phoneNumber: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_phoneNumber","type":"uint256"}>
};

/**
 * Calls the "setMsigToPhoneNumber" function on the contract.
 * @param options - The options for the "setMsigToPhoneNumber" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setMsigToPhoneNumber } from "TODO";
 *
 * const transaction = setMsigToPhoneNumber({
 *  multiSigAddr: ...,
 *  phoneNumber: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setMsigToPhoneNumber(
  options: BaseTransactionOptions<SetMsigToPhoneNumberParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x46465c26",
  [
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
  []
],
    params: [options.multiSigAddr, options.phoneNumber]
  });
};


