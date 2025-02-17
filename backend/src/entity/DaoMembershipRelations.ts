import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique } from "typeorm";
import { Dao } from "./Dao";
import { MemberDetails } from "./MemberDetails";

export enum DaoMembershipStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum DaoRoleEnum {
  CHAIRPERSON = "Chairperson",
  SECRETARY = "Secretary",
  TREASURER = "Treasurer",
  MEMBER = "Member",
  FUNDER = "Funder",
}

@Entity()
@Unique(["dao", "member"]) // Ensure a member cannot have duplicate entries in the same DAO
export class DaoStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Dao, (dao) => dao.daoStatus, { onDelete: "CASCADE" }) // Track which DAO the member belongs to
  dao: Dao;

  @ManyToOne(() => MemberDetails, (member) => member.daoStatus, { onDelete: "CASCADE" }) // Track the member
  member: MemberDetails;

  @Column({ type: "text", enum: DaoMembershipStatus, default: DaoMembershipStatus.PENDING }) // Use an enum for better control
  status: DaoMembershipStatus;
}


// Relation for Join Date
@Entity()
@Unique(["dao", "member"]) // A member has only one join date per DAO
export class DaoJoinDate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Dao, (dao) => dao.daoJoinDates, { onDelete: "CASCADE" }) // Track which DAO the member belongs to
  dao: Dao;

  @ManyToOne(() => MemberDetails, (member) => member.daoJoinDates, { onDelete: "CASCADE" }) // Track the member
  member: MemberDetails;

  @Column({ type: "enum", default: () => "CURRENT_TIMESTAMP" }) // Store join date
  joinDate: Date;
}

// Relation for Role
@Entity()
@Unique(["dao", "member"]) // A member has only one role per DAO
export class DaoRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Dao, (dao) => dao.daoRoles, { onDelete: "CASCADE" }) // Track which DAO the member belongs to
  dao: Dao;

  @ManyToOne(() => MemberDetails, (member) => member.daoRoles, { onDelete: "CASCADE" }) // Track the member
  member: MemberDetails;

  @Column({ type: "enum", enum: DaoRoleEnum }) // Use the enum for better validation
  role: DaoRoleEnum;
}

