import {
  PrimaryColumn,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToOne,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  Index,
} from "typeorm";
import { Dao } from "./Dao";
//import { PhoneAndAddressMapping } from "./PhoneToAddress";

@Entity()
export class MemberDetails {
  @PrimaryGeneratedColumn()
  memberId: number;

  @Column()
  memberCustomIdentifier: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Index("IDX_PHONE_NUMBER_UNIQUE", { unique: true, where: "phoneNumber IS NOT NULL" }) // Unique only if not null
  @Column({ nullable: true })
  phoneNumber?: number;

  @Index("IDX_EMAIL_UNIQUE", { unique: true, where: "email IS NOT NULL" }) // Unique only if not null
  @Column({ nullable: true })
  email?: string;

  @Index("IDX_NATIONAL_ID_UNIQUE", { unique: true, where: "nationalIdNo IS NOT NULL" }) // Unique only if not null
  @Column({ nullable: true })
  nationalIdNo?: number;

  @Column({ nullable: true })
  memberRole?: string;

  @Index("IDX_MEMBER_ADDR_UNIQUE", { unique: true, where: "memberAddr IS NOT NULL" }) // Unique only if not null
  @Column({ nullable: true })
  memberAddr?: string;

  @Column({ nullable: true })
  daoMultiSigAddr?: string;

  //@ManyToMany(() => Dao, dao => dao.members)
  //daos: Dao[];
  //many to many relation where one member can have multiple daos and one dao can have multiple members
  @ManyToMany(() => Dao, (dao) => dao.members)
  daos: Dao[]; //array of daos that a member is in
  static firstName: any;

  //relation where a phone number can be mapped to an address in the phone number address map class  or not
  // @OneToOne(() => PhoneAndAddressMapping, phoneAndAddressMapping => phoneAndAddressMapping.phoneNumberToMap, {nullable: true})
  //phoneAndAddressMapping?: PhoneAndAddressMapping;

  //we can have a boolean to keep track of whether a phone number is mapped to an address in the mapping for easier operations
}
