export interface IVote {
    voteId?: string; 
    proposalId: string; 
    voterAddr: string;
    voteValue: boolean;  //true for upvote, false for downvote
    proposal: IProposal;  //relationship with proposal entity
}
export interface IProposal{
    proposalId?: string; 
    proposalOwner: string; 
    proposalTitle: string; 
    projectSummary: string; 
    proposalDescription: string; 
    proposalStatus: string;
    amountRequested: number; 
    daoMultiSigAddr: string; 
    numUpVotes: number; 
    votes: IVote; 
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
    daoMultiSigs: string[];
    daoMultiSigAddr: string;
    proposals: IProposal;  //relationship with proposal entity
    members: IMemberDetails;  //relationship with memberDetails entity

}

export interface IMemberDetails {
    memberId?: number;
    firstName: string;
    lastName: string;
    phoneNumber: number;
    nationalIdNo: number;
    memberRole: string;  //funder, owner, member
    memberAddr: string;
    daoMultiSig: string;
    daos?: IDao[]; 
}

