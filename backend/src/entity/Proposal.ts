import { PrimaryColumn, Column,  Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import {Vote} from "./Vote";
import { Dao } from "./Dao";

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
    numUpVotes: number;

    @Column()
    numDownVotes: number;

    @OneToMany(() => Vote, (vote) => vote.proposalId)
    votes: Vote;
     
    //relation where one proposal can only belong to one dao but one dao can have multiple proposals 
    @ManyToOne(() => Dao, dao => dao.proposal)
    @JoinColumn({ name: "daoId" })
    dao: Dao;

}