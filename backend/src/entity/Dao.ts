import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
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
  @OneToMany(() => Proposal, (proposal) => proposal.dao)
  proposals: Proposal[];

}
