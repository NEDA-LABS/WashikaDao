import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Dao } from "./Dao";
import { cp } from "fs";
//import { PhoneAndAddressMapping } from "./PhoneToAddress";

@Entity()
export class MemberDetails {
  @PrimaryGeneratedColumn()
  memberId: number;

  @Column({ unique: true })
  memberCustomIdentifier: string;

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

  @Column({ unique: true })
  memberAddr?: string;

}
