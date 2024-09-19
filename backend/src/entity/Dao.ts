import {  PrimaryGeneratedColumn, Column, Entity, OneToMany } from "typeorm";
import { Proposal } from "./Proposal";
import { MemberDetails } from "./MemberDetails";

@Entity()
export class Dao {
  @PrimaryGeneratedColumn()
  daoId: number

  @Column()
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

  @Column()
  daoImageIpfsHash: string

  @Column()
  daoMultiSigAddr: string  
  //one to many relation where one dao can have multiple proposals but one proposal cannot have multiple daos 
  @OneToMany(() => Proposal, proposal => proposal.dao)
  proposal: Proposal[]; 

  //relation where one member can belong to multiple daos and one member can own multiple daos
  //dao can have multiple members & can be owned by multiple members
  //member can have multiple daos & can be an owner of multiple daos
  //many to many relation where one member can have multiple daos and one dao can have multiple members
  @OneToMany(() => MemberDetails, memberDetails => memberDetails.daos)
  members: MemberDetails[];

  @Column()
  daoMultiSigs: string; //array of multisigs  
  
}