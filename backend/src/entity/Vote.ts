import {  PrimaryGeneratedColumn, Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Proposal } from "./Proposal";

@Entity()
@Unique(["proposalId", "voterAddr"])
export class Vote{
    @PrimaryGeneratedColumn()
    voteId: number;

    @Column()
    voterAddr: string;

    @Column()
    voteValue: boolean;  //true for upvote, false for downvote

    @ManyToOne(() => Proposal, proposal =>  proposal.votes)
    @JoinColumn({ name: "proposalId" })
    proposalId?: Proposal;
}
