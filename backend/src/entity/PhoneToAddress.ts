import {  PrimaryGeneratedColumn, Column, Entity, OneToMany } from "typeorm";
import { Proposal } from "./Proposal";
import { IProposal } from "../Interfaces/EntityTypes";
import { MemberDetails } from "./MemberDetails"; 
//Here I want an entity relationship that represents a mapping betweeen phone numbers and multisig addresses 
@Entity() 
export class PhoneAndAddressMapping {
    @PrimaryGeneratedColumn()
    phoneAddrMapId: number

    @Column()
    phoneNumberToMap: string; 

    @Column()
    AddrToMap: string;
}