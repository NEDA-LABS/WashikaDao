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
    votes?: IVote[];  // Relationship with Vote entities
    dao?: IDao;  // Relationship with Dao entities
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
    proposals?: IProposal[];  // Relationship with Proposal entities
    members?: IMemberDetails[];  // Relationship with MemberDetails entities
}

export interface IMemberDetails {
    memberId?: number;
    memberCustomIdentifier: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    nationalIdNo?: string;
    memberAddr?: string; // Relationship with DaoRole entities
}
