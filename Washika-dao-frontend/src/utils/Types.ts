import { Address } from "thirdweb";
import { Account } from "thirdweb/wallets";

// =====================
// DAO INTERFACES
// =====================

/**
 * Base DAO interface (common fields for all DAOs)
 */
export interface IDao {
  daoName: string;
  daoLocation: string;
  targetAudience?: string;
}

/**
 * Blockchain DAO interface (extends base with on-chain fields)
 */
export interface IBlockchainDao extends IDao {
  daoObjective?: string;
  daoTargetAudience?: string;
  daoCreator: `0x${string}`;
  daoId: `0x${string}`;
}

/**
 * Backend DAO interface (extends base with backend-specific fields)
 */
export interface IBackendDao extends IDao {
  daoTitle?: string;
  daoDescription?: string;
  daoOverview?: string;
  daoImageIpfsHash?: string;
  daoRegDocs?: string;
  daoMultiSigAddr?: string;
  multiSigPhoneNo?: string;
  kiwango?: number;
  accountNo?: string;
  nambaZaHisa?: number;
  kiasiChaHisa?: number;
  interestOnLoans?: number;
  daoTxHash?: string;
  chairpersonAddr?: string;
}

// =====================
// PROPOSAL INTERFACES
// =====================

/**
 * Base Proposal interface (common fields for all proposals)
 */
export interface IProposal {
  proposalTitle: string;
  proposalStatus?: string;
}

/**
 * Blockchain Proposal interface (extends base with on-chain fields)
 */
export interface IBlockchainProposal extends IProposal {
  proposalOwner: string;
  proposalId: `0x${string}`;
  daoId: string;
  proposalUrl: string;
  proposalCreatedAt: bigint;
}

/**
 * Backend Proposal interface (extends base with backend-specific fields)
 */
export interface IBackendProposal extends IProposal {
  daoTitle?: string;
  daoDescription?: string;
  daoOverview?: string;
  proposalId?: string;
  proposalUrl?: string;
  proposalCreatedAt?: number | string;
  // Add more backend-specific fields as needed
}

// =====================
// VOTE INTERFACES
// =====================

/**
 * Base Vote interface (common fields for all votes)
 */
export interface IVote {
  voteType: string | boolean;
}

/**
 * Blockchain Vote interface (extends base with on-chain fields)
 */
export interface IBlockchainVote extends IVote {
  voterAddress: string;
  proposalId: string;
  daoId: string;
  voteId: string;
}

/**
 * Backend Vote interface (extends base with backend-specific fields)
 */
export interface IBackendVote extends IVote {
  voterAddr?: string;
  proposalOwner?: string;
  // Add more backend-specific fields as needed
}

// =====================
// EXISTING TYPES (PRESERVED)
// =====================

export interface IBackendDaoCreation {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview?: string;
  daoImageIpfsHash?: string;
  daoRegDocs?: string;  // Made optional
  daoMultiSigAddr?: string;  // Made optional
  multiSigPhoneNo: string;
  kiwango?: number;  // Made optional
  accountNo?: string;  // Made optional
  nambaZaHisa?: number;  // Made optional
  kiasiChaHisa?: number;  // Made optional
  interestOnLoans?: number;  // Made optional
  daoTxHash?: string;  // Made optional
}

export interface IFetchedBackendDao {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview?: string;
  daoImageIpfsHash?: string;
  daoRegDocs?: string;
  daoMultiSigAddr: string;
  multiSigPhoneNo?: string;
  kiwango: number;
  accountNo?: string;
  nambaZaHisa?: number;
  kiasiChaHisa?: number;
  interestOnLoans?: number;
  daoTxHash?: string;
  chairpersonAddr?: string;
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
  memberRole: DaoRoleEnum | string;
  memberCustomIdentifier: string;
  memberAddr?: string;
}

export interface IBackendDaoCreatorDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalIdNo: string;
  memberRole: string;
  daoCreatorAddress: Account | string | Address | undefined;
}

export interface IDaoMemberDetails {
  memberName: string;
  emailAddress: string;
  phoneNumber: string;
  nationalId: string;
  role: DaoRoleEnum;
  userAddress: Address;
  multiSigPhoneNo: number | bigint;
  memberCustomIdentifier: string;
}

export type daoCreationTxResult = {
  txHash: string;
};

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

export interface OnchainDao {
  daoName: string;
  daoLocation: string;
  daoObjective: string;
  daoTargetAudience: string;
  daoCreator: `0x${string}`;
  daoId: `0x${string}`;
}

export interface OnChainProposal {
  proposalOwner: string;
  proposalId: `0x${string}`;
  daoId: string;
  proposalUrl: string;
  proposalTitle: string;
  proposalStatus: string;
  proposalCreatedAt: bigint;
}


