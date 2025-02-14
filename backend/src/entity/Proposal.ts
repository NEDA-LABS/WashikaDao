import { PrimaryColumn, Column,  Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import {Vote} from "./Vote";
import { Dao } from "./Dao";
import {SrvRecord} from "dns";

@Entity()
export class Proposal {
    @PrimaryGeneratedColumn()
    proposalId: number;

    @Column()
    proposalCustomIdentifier: string;

    @Column()
    proposalOwner: string;

    @Column()
    proposalTitle: string;

    @Column()
    proposalSummary: string;

    @Column()
    proposalDescription: string;

    @Column()
    proposalStatus: string;

    @Column()
    amountRequested: number;

    @Column()
    profitSharePercent: number;

    @Column()
    daoMultiSigAddr: string;

    @Column({ default: 0 })
    numUpVotes: number;

    @Column({ default: 0 })
    numDownVotes: number;

    @OneToMany(() => Vote, (vote) => vote.proposal)
    votes: Vote[];

    //relation where one proposal can only belong to one dao but one dao can have multiple proposals
    @ManyToOne(() => Dao, dao => dao.proposals)
    @JoinColumn({ name: "daoId" })
    dao: Dao;

}
