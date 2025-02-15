import {
  Column,
  Entity,
  Index,
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

  @Column({ unique: true, length: 100 })
  daoName: string;

  @Column({ length: 100 })
  daoLocation: string;

  @Column({ length: 100 })
  targetAudience: string;

  @Column({ length: 100 })
  daoTitle: string;

  @Column("text")
  daoDescription: string;

  @Column("text")
  daoOverview: string;

  @Column({ type: "varchar", unique: true })
  @Index()
  multiSigPhoneNo: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  kiwango: number;

  @Column({ type: "bigint" })
  accountNo: string;

  @Column()
  nambaZaHisa: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  kiasiChaHisa: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  interestOnLoans: number;

  @Column({ length: 255 })
  daoImageIpfsHash: string;

  @Column({ length: 255 })
  daoRegDocs: string;

  @Column({ length: 255 })
  daoTxHash: string;

  @Index()
  @Column({ unique: true })
  daoMultiSigAddr: string;

  //one to many relation where one dao can have multiple proposals but one proposal cannot have multiple daos
  @OneToMany(() => Proposal, (proposal) => proposal.dao, { lazy: true })
  proposals: Promise<Proposal[]>;

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
