import { Address } from "thirdweb";

export type DaoCreationFormInputs = {
    _daoName: string;
    _location: string;
    _targetAudience: string;
    _daoTitle: string;
    _daoDescription: string;
    _daoOverview: string;
    _daoImageUrlHash: string;
    _multiSigPhoneNo: any;
   }

   export interface IBackendDaoCreation{
    daoName: string;
    daoLocation: string;
    targetAudience: string;
    daoTitle: string;
    daoDescription: string;
    daoOverview: string;
    daoImageIpfsHash: string;
    daoRegDocs: string;
    multiSigAddr: string;
    multiSigPhoneNo: number;
    kiwango: number;
    accountNo: number;
    nambaZaHisa: string;
    kiasiChaHisa: string;
    interestOnLoans: string;
  }

export interface IBlockchainDaoCreation{
    daoName: string;
    daoLocation: string;
    targetAudience: string;
    daoTitle: string;
    daoDescription: string;
    daoOverview: string;
    daoImageIpfsHash: string;
    daoMultiSigAddr: Address;
    multiSigPhoneNo: BigInt;
}

export interface IBackendDaoMember {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    nationalIdNo: string;
    memberRole: string;
  }

export interface IDaoMemberDetails {
    memberName: string;
    emailAddress: string;
    phoneNumber: any;
    nationalId: number;
    role: any;
    userAddress: Address;
    multiSigPhoneNo: any | bigint;
}

export type daoCreationTxResult = {
  txHash: string;
}

export interface IBlockchainProposal {
    multiSigAddr: Address;
    proposalTitle: string;
    proposalSummary: string; //Remove in mainnet
    proposalDescription: string;
    proposalDuration: number;
    proposalStatus: string;
}
export interface IBackendProposalCreate extends IBlockchainProposal {
    proposalOwner: Address;
    proposalId: number;
    daoId: number;
    amountRequested: number;
    profitSharePercent: number;
    numUpVotes: number;
    numDownVotes: number;
    proposalFileUrl: string; //Maybe from ipfs
    otherMember: string;
}

export interface IVoteDetails {
    voterAddr: Address;
    proposalOwner: Address;
    voteType: string | any
}




