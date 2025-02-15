import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Dao } from "./Dao";
import { DaoJoinDate, DaoRole, DaoStatus } from "./DaoMembershipRelations";
//import { PhoneAndAddressMapping } from "./PhoneToAddress";

@Entity()
export class MemberDetails {
  @PrimaryGeneratedColumn()
  memberId: number;

  @Column({ length: 50 })
  firstName?: string;

  @Column({ length: 50 })
  lastName?: string;

  @Column({ type: "varchar", length: 20, unique: true })
  @Index()
  phoneNumber?: string;

  @Column({ unique: true, length: 100 })
  @Index()
  email?: string;

  @Column({ unique: true, length: 20 })
  nationalIdNo?: string;

  @Column({ nullable: true })
  @Index("IDX_MEMBER_ADDRESS_UNIQUE", { unique: true, where: "memberAddr IS NOT NULL" })
  memberAddr?: string;

  //many to many relation where one member can have multiple daos and one dao can have multiple members
  @ManyToMany(() => Dao, (dao) => dao.members)
  daos: Dao[]; //array of daos that a member is in

  @OneToMany(() => DaoStatus, (daoStatus) => daoStatus.member, {
    cascade: true,
  }) // Track DAO memberships
  daoStatus: DaoStatus[];

  @OneToMany(() => DaoJoinDate, (daoJoinDate) => daoJoinDate.member, {
    cascade: true,
  })
  daoJoinDates: DaoJoinDate[];

  @OneToMany(() => DaoRole, (daoRole) => daoRole.member, { cascade: true })
  daoRoles: DaoRole[];

  //relation where a phone number can be mapped to an address in the phone number address map class  or not
  // @OneToOne(() => PhoneAndAddressMapping, phoneAndAddressMapping => phoneAndAddressMapping.phoneNumberToMap, {nullable: true})
  //phoneAndAddressMapping?: PhoneAndAddressMapping;

  //we can have a boolean to keep track of whether a phone number is mapped to an address in the mapping for easier operations
}
