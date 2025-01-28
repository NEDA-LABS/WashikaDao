import {  PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Proposal } from "./Proposal";
import { MemberDetails } from "./MemberDetails";

@Entity()
export class Dao {
  @PrimaryGeneratedColumn()
  daoId: number

  @Column({ unique: true })
  daoName: string

  @Column()
  daoLocation: string

  @Column()
  targetAudience: string

  @Column()
  daoTitle: string

  @Column()
  daoDescription: string

  @Column()
  daoOverview: string

  @Column({ unique: true })
  multiSigPhoneNo: number

  @Column({ unique: true })
  kiwango: number

  @Column()
  accountNo: number

  @Column()
  nambaZaHisa: number

  @Column()
  kiasiChaHisa: number

  @Column()
  interestOnLoans: number

  @Column()
  daoImageIpfsHash: string

  @Column()
  daoRegDocs: string

  @Column({ unique: true })
  daoMultiSigAddr: string
  //one to many relation where one dao can have multiple proposals but one proposal cannot have multiple daos
  @OneToMany(() => Proposal, proposal => proposal.dao)
  proposal: Proposal[];

  //relation where one member can belong to multiple daos and one member can own multiple daos
  //dao can have multiple members & can be owned by multiple members
  //member can have multiple daos & can be an owner of multiple daos
  //many to many relation where one member can have multiple daos and one dao can have multiple members
  @ManyToMany(() => MemberDetails, memberDetails => memberDetails.daos, {
    cascade: true,
  })
  @JoinTable() // This specifies that the Dao entity owns the relationship and a join table is needed
  members: MemberDetails[];

  //@Column("simple-array")
  //daoMultiSigs: string[]; //array of multisigs

}
