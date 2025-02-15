import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DaoJoinDate, DaoRole, DaoStatus } from "./DaoMembershipRelations";
import { MemberDetails } from "./MemberDetails";
import { Proposal } from "./Proposal";

@Entity()
export class Dao {
  @PrimaryGeneratedColumn()
  daoId: number;

  @Column({ unique: true })
  daoName: string;

  @Column()
  daoLocation: string;

  @Column()
  targetAudience: string;

  @Column()
  daoTitle: string;

  @Column()
  daoDescription: string;

  @Column()
  daoOverview: string;

  @Column({ unique: true })
  multiSigPhoneNo: number;

  @Column()
  kiwango: number;

  @Column()
  accountNo: number;

  @Column()
  nambaZaHisa: number;

  @Column()
  kiasiChaHisa: number;

  @Column()
  interestOnLoans: number;

  @Column()
  daoImageIpfsHash: string;

  @Column()
  daoRegDocs: string;

  @Column()
  daoTxHash: string;

  @Column({ unique: true })
  daoMultiSigAddr: string;

  //one to many relation where one dao can have multiple proposals but one proposal cannot have multiple daos
  @OneToMany(() => Proposal, (proposal) => proposal.dao)
  proposals: Proposal[];

  // relation where one member can belong to multiple daos and one member can own multiple daos
  // dao can have multiple members & can be owned by multiple members
  // member can have multiple daos & can be an owner of multiple daos
  // many to many relation where one member can have multiple daos and one dao can have multiple members
  @ManyToMany(() => MemberDetails, (memberDetails) => memberDetails.daos, {
    cascade: true,
  })
  @JoinTable({ name: "dao_members" }) // This specifies that the Dao entity owns the relationship and a join table is needed
  members: MemberDetails[];

  @OneToMany(() => DaoStatus, (daoStatus) => daoStatus.dao, { cascade: true }) // Track member statuses
  daoStatus: DaoStatus[];

  @OneToMany(() => DaoJoinDate, (daoJoinDate) => daoJoinDate.dao, {
    cascade: true,
  })
  daoJoinDates: DaoJoinDate[];

  @OneToMany(() => DaoRole, (daoRole) => daoRole.dao, { cascade: true })
  daoRoles: DaoRole[];

  @Column("json")
  daoMultiSigs: string[]; //array of multisigs
}
