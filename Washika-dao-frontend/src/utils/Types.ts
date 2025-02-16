import { Address } from "thirdweb";

export type DaoCreationFormInputs = {
  _daoName: string;
  _location: string;
  _targetAudience: string;
  _daoTitle: string;
  _daoDescription: string;
  _daoOverview: string;
  _daoImageUrlHash: string;
  _multiSigPhoneNo: number;
};

export interface IBackendDaoCreation {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview: string;
  daoImageIpfsHash: string;
  daoRegDocs: string;
  daoMultiSigAddr: string;
  multiSigPhoneNo: number;
  kiwango: number;
  accountNo: number;
  nambaZaHisa: string;
  kiasiChaHisa: string;
  interestOnLoans: string;
  daoTxHash: string;
}

export interface IBlockchainDaoCreation {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview: string;
  daoImageIpfsHash: string;
  daoMultiSigAddr: Address;
  multiSigPhoneNo: bigint;
}

export interface IBackendDaoMember {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalIdNo: string;
  memberRole: string;
  memberCustomIdentifier: string;
}

export interface IDaoMemberDetails {
  memberName: string;
  emailAddress: string;
  phoneNumber: number;
  nationalId: number;
  role: string;
  userAddress: Address;
  multiSigPhoneNo: number | bigint;
}

export type daoCreationTxResult = {
  txHash: string;
};

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
  voteType: string;
}

// src/types/daoTypes.ts
export enum DaoRoleEnum {
  CHAIRPERSON = "Chairperson",
  SECRETARY = "Secretary",
  TREASURER = "Treasurer",
  MEMBER = "Member",
  FUNDER = "Funder",
}

export interface Dao {
  daoMultiSigAddr: string;
  daoName: string;
  role: DaoRoleEnum | null;
}

