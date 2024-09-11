import { PrimaryColumn, Column,  Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import {Vote} from "./Vote.ts";

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
    proposalStatus: string; //closed, open

    @Column() 
    amountRequested: number;  

    @Column() 
    daoMultiSigAddr: string;

    @OneToMany(() => Vote, vote => vote.proposal)
    votes: Vote[];


}