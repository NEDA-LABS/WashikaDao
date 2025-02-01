export interface IVote {
    proposalCustomIdentifier?: number;
    voterAddr: string;
    voteValue: boolean;  //true for upvote, false for downvote
}
export interface IProposal{
    proposalId?: number;
    proposalOwner: string;
    proposalTitle: string;
    projectSummary: string;
    proposalDescription: string;
    proposalStatus: string;
    amountRequested: number;
    profitSharePercent: number;
    daoMultiSigAddr: string;
    numUpvotes: number;
    numDownvotes: number;
    votes?: IVote[];
}

export interface IDao {
    daoId?: string;
    daoName: string
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
    proposals: IProposal;  //relationship with proposal entity
    members: IMemberDetails;  //relationship with memberDetails entity

}

export interface IMemberDetails {
    memberId?: number;
    firstName: string;
    lastName: string;
    phoneNumber: number;
    email: string;
    nationalIdNo: number;
    memberRole: string;  //funder, owner, member
    memberAddr: string;
    daos?: IDao[];
}

