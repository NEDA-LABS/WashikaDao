import { DaoMembershipStatus } from "../entity/DaoMembershipRelations";

export interface IVote {
    voteId?: number;
    proposalCustomIdentifier?: string;
    voterAddr: string;
    voteValue: boolean;  // true for upvote, false for downvote
}

export interface IProposal {
    proposalId?: number;
    proposalCustomIdentifier: string;
    proposalOwner: string;
    proposalTitle: string;
    proposalSummary: string;
    proposalDescription: string;
    proposalStatus: string;
    amountRequested: number;
    profitSharePercent: number;
    daoMultiSigAddr: string;
    votes?: IVote[];  // Relationship with Vote entity
    dao?: IDao;  // Relationship with Dao entity
}

export interface IDao {
    daoId?: number;
    daoName: string;
    daoLocation: string;
    targetAudience: string;
    daoTitle: string;
    daoDescription: string;
    daoOverview: string;
    daoImageIpfsHash: string;
    daoMultiSigAddr: string;
    multiSigPhoneNo: number;
    kiwango: number;
    accountNo: number;
    nambaZaHisa: number;
    kiasiChaHisa: number;
    interestOnLoans: number;
    daoTxHash: string;
    daoRegDocs: string;
    proposals?: IProposal[];  // Relationship with Proposal entity
    members?: IMemberDetails[];  // Relationship with MemberDetails entity
    daoStatus?: IDaoStatus[];  // Relationship with DaoStatus entity
    daoJoinDates?: IDaoJoinDate[];  // Relationship with DaoJoinDate entity
    daoRoles?: IDaoRole[];  // Relationship with DaoRole entity
    daoMultiSigs: string[];
}

export interface IMemberDetails {
    memberId?: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    nationalIdNo?: string;
    memberAddr?: string;
    daos?: IDao[];  // Relationship with Dao entity
    daoStatus?: IDaoStatus[];  // Relationship with DaoStatus entity
    daoJoinDates?: IDaoJoinDate[];  // Relationship with DaoJoinDate entity
    daoRoles?: IDaoRole[];  // Relationship with DaoRole entity
}

export interface IDaoStatus {
    id?: number;
    dao: IDao;
    member: IMemberDetails;
    status: DaoMembershipStatus;
}

export interface IDaoJoinDate {
    id?: number;
    dao: IDao;
    member: IMemberDetails;
    joinDate: Date;
}

export interface IDaoRole {
    id?: number;
    dao: IDao;
    member: IMemberDetails;
    role: string;
}
