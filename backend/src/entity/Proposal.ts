import { PrimaryColumn, Column,  Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import {Vote} from "./Vote";

@Entity()
export class Proposal {
    @PrimaryGeneratedColumn() 
    proposalId: number; 

    @Column() 
    proposalOwner: string; 

    @Column() 
    proposalTitle: string; 

    @Column() 
    projectSummary: string; 

    @Column() 
    proposalDescription: string; 
    
    @Column() 
    proposalStatus: string; //closed, open --is this proposal closed or open to voting. 

    @Column() 
    amountRequested: number;  

    @Column() 
    daoMultiSigAddr: string; 

    @Column() 
    numUpvotes: number;

    @OneToMany(() => Vote, vote => vote.proposal)
    votes: Vote[];


}