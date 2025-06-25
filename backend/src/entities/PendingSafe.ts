// src/entities/PendingSafe.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class PendingSafe {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    daoId: string;

    @Column()
    safeAddress: string;

    @Column("simple-array")
    signers: string[]; // Array of signer addresses

    @Column()
    threshold: number;

    @Column("jsonb")
    deploymentConfig: any; // Safe deployment config

    @Column()
    safeTxHash: string;

    @Column("jsonb")
    signatures: { [signer: string]: string }; // Key: signer address, Value: signature

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ type: "timestamp" })
    expiresAt: Date;
}