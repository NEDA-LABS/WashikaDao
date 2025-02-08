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
} from "typeorm";
import { Dao } from "./Dao";
//import { PhoneAndAddressMapping } from "./PhoneToAddress";

@Entity()
export class MemberDetails {
  @PrimaryGeneratedColumn()
  memberId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  phoneNumber: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  nationalIdNo: number;

  @Column()
  memberRole: string; //funder, chairperson, member, treasurer, secretary

  //optional member address
  @Column({ nullable: true, unique: true })
  memberAddr?: string;

  @BeforeInsert()
  @BeforeUpdate()
  sanitizeMemberAddr() {
    if (this.memberAddr === "") {
      this.memberAddr = null; // Convert empty strings to NULL
    }
  }

  @Column()
  daoMultiSigAddr: string;

  //@ManyToMany(() => Dao, dao => dao.members)
  //daos: Dao[];
  //many to many relation where one member can have multiple daos and one dao can have multiple members
  @ManyToMany(() => Dao, (dao) => dao.members, { nullable: true })
  daos: Dao[]; //array of daos that a member is in
  static firstName: any;

  //relation where a phone number can be mapped to an address in the phone number address map class  or not
  // @OneToOne(() => PhoneAndAddressMapping, phoneAndAddressMapping => phoneAndAddressMapping.phoneNumberToMap, {nullable: true})
  //phoneAndAddressMapping?: PhoneAndAddressMapping;

  //we can have a boolean to keep track of whether a phone number is mapped to an address in the mapping for easier operations
}
