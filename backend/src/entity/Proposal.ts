import { PrimaryColumn, Column,  Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import {Vote} from "./Vote";
import { Dao } from "./Dao";

@Entity()
export class Proposal {
    @PrimaryGeneratedColumn()
    proposalId: number;

    @Column({ unique: true })
    proposalCustomIdentifier: string;

    @Column()
    proposalOwner: string;

    @Column({ length: 255 })
    proposalTitle: string;

    @Column("text")
    proposalSummary: string;

    @Column("text")
    proposalDescription: string;

    @Column({ length: 50 })
    proposalStatus: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    amountRequested: number;

    @Column({ type: "decimal", precision: 5, scale: 2 })
    profitSharePercent: number;

    @Column({ length: 255 })
    daoMultiSigAddr: string;

    @OneToMany(() => Vote, (vote) => vote.proposal, { cascade: ["remove"] })
    votes: Vote[];
    
    //relation where one proposal can only belong to one dao but one dao can have multiple proposals
    @ManyToOne(() => Dao, dao => dao.proposals)
    @JoinColumn({ name: "daoId" })
    dao: Dao;

}
