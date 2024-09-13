import {  PrimaryGeneratedColumn, Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm"; 
import { Proposal } from "./Proposal.ts"; 

@Entity() 
@Unique(["proposalId", "voterAddr"])
export class Vote{
    @PrimaryGeneratedColumn() 
    voteId: number; 

    @Column() 
    proposalId: number; 

    @Column() 
    voterAddr: number;

    @Column() 
    voteValue: boolean;  //true for upvote, false for downvote

    @ManyToOne(() => Proposal, proposal =>  proposal.votes) 
    @JoinColumn({ name: "proposalId" })
    proposal: Proposal;
}