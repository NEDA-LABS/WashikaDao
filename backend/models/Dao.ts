import {  PrimaryGeneratedColumn, Column, Entity } from "typeorm";


@Entity()
export class Dao {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  daoName: string

  @Column()
  daoLocation: string

  @Column()
  targetAudience: string

  @Column()
  daoTitle: string

  @Column()
  daoDescription: string

  @Column()
  daoOverview: string

  @Column()
  daoImageIpfsHash: string

  @Column()
  multiSigAddr: string

}

