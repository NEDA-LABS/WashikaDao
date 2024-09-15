import { PrimaryColumn, Column,  Entity, PrimaryGeneratedColumn, ManyToMany, OneToOne } from "typeorm";
import { Dao } from "./Dao";
import { PhoneAndAddressMapping } from "./PhoneToAddress";

@Entity()
export class MemberDetails {
    @PrimaryGeneratedColumn()
    memberId: number

    @Column() 
    memberName: string 

    @Column()
    phoneNumber: number

    @Column()
    nationalIdNo: number

    @Column()
    memberRole: string//funder, owner, member 

    //optional member address 
    @Column({nullable: true})
    memberAddr?: string

    @Column()
    daoMultiSig: string 

    //many to many relation where one member can have multiple daos and one dao can have multiple members
    @ManyToMany(() => Dao, dao => dao.members, {nullable: true})
    daos: Dao[]; //array of daos that a member is in 

    //relation where a phone number can be mapped to an address in the phone number address map class  or not 
    @OneToOne(() => PhoneAndAddressMapping, phoneAndAddressMapping => phoneAndAddressMapping.phoneNumberToMap, {nullable: true})
    phoneAndAddressMapping?: PhoneAndAddressMapping;

    //we can have a boolean to keep track of whether a phone number is mapped to an address in the mapping for easier operations 
}