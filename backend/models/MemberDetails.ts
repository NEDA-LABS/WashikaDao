import { PrimaryColumn, Column,  Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MemberDetails {
    @PrimaryGeneratedColumn()
    memberId: number

    @Column()
    phoneNumber: number

    @Column()
    nationalIdNo: number

    @Column()
    memberRole: string//funder, owner, member 

    @Column()
    memberAddr: string

    @Column()
    daoMultiSig: string

}


