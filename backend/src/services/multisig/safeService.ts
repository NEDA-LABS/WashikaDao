// src/services/safe.service.ts
import { getRepository } from "typeorm";
import { PendingSafe } from "../entities/PendingSafe";
import { SafeFactory, SafeAccountConfig } from "@safe-global/protocol-kit";
import { SafeApiKit } from "@safe-global/api-kit";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";

export class SafeService {
    private readonly JWT_SECRET = process.env.JWT_SECRET!;
    private readonly RPC_URL = process.env.RPC_URL!;
    private readonly SAFE_SERVICE_URL = process.env.SAFE_SERVICE_URL!;

    async initiateSafeCreation(daoId: string, signers: string[], threshold: number) {
        // Initialize Ethereum adapter
        const provider = new ethers.providers.JsonRpcProvider(this.RPC_URL);
        const deployer = provider.getSigner(0);
        const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: deployer });

        // Create Safe configuration
        const safeAccountConfig: SafeAccountConfig = {
            owners: signers,
            threshold,
        };

        // Predict Safe address
        const safeFactory = await SafeFactory.create({ ethAdapter });
        const safeAddress = await safeFactory.predictSafeAddress(safeAccountConfig);

        // Generate deployment transaction
        const safeDeploymentTx = await safeFactory.createSafeDeploymentTransaction(safeAccountConfig);

        // Create pending safe record
        const pendingSafeRepo = getRepository(PendingSafe);
        const pendingSafe = pendingSafeRepo.create({
            daoId,
            safeAddress,
            signers,
            threshold,
            deploymentConfig: safeDeploymentTx.data,
            safeTxHash: safeDeploymentTx.data.safeTxHash,
            signatures: {},
            expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours expiration
        });

        await pendingSafeRepo.save(pendingSafe);

        // Generate JWT tokens for each signer
        const tokens = signers.map(signer =>
            jwt.sign({ daoId, signer, safeAddress }, this.JWT_SECRET, { expiresIn: "2h" })
        );

        return { safeAddress, tokens };
    }

    async getSignerData(token: string) {
        try {
            const { daoId, signer, safeAddress } = jwt.verify(token, this.JWT_SECRET) as any;

            const pendingSafeRepo = getRepository(PendingSafe);
            const pendingSafe = await pendingSafeRepo.findOne({
                where: { daoId, safeAddress }
            });

            if (!pendingSafe) {
                throw new Error("Safe deployment not found");
            }

            return {
                daoName: `DAO ${daoId}`, // In real app, fetch from DAO service
                safeAddress,
                signerAddress: signer,
                transactionData: pendingSafe.safeTxHash
            };
        } catch (error) {
            throw new Error("Invalid or expired token");
        }
    }

    async submitSignature(token: string, signature: string) {
        const { daoId, signer, safeAddress } = jwt.verify(token, this.JWT_SECRET) as any;

        const pendingSafeRepo = getRepository(PendingSafe);
        const pendingSafe = await pendingSafeRepo.findOne({
            where: { daoId, safeAddress }
        });

        if (!pendingSafe) {
            throw new Error("Safe deployment not found");
        }

        // Add signature
        pendingSafe.signatures[signer] = signature;
        await pendingSafeRepo.save(pendingSafe);

        // Check if threshold reached
        if (Object.keys(pendingSafe.signatures).length >= pendingSafe.threshold) {
            await this.deploySafe(pendingSafe);
            return { status: "deployed", safeAddress };
        }

        return { status: "signed" };
    }

    private async deploySafe(pendingSafe: PendingSafe) {
        const provider = new ethers.providers.JsonRpcProvider(this.RPC_URL);
        const deployer = provider.getSigner(0);
        const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: deployer });

        const safeFactory = await SafeFactory.create({ ethAdapter });

        // Deploy Safe
        const safe = await safeFactory.deploySafe({
            safeAccountConfig: {
                owners: pendingSafe.signers,
                threshold: pendingSafe.threshold
            },
            safeDeploymentConfig: pendingSafe.deploymentConfig
        });

        // Update DAO with safe address (pseudo-code)
        // await this.daoService.linkSafe(pendingSafe.daoId, pendingSafe.safeAddress);

        // Cleanup pending record
        const pendingSafeRepo = getRepository(PendingSafe);
        await pendingSafeRepo.delete(pendingSafe.id);
    }
}