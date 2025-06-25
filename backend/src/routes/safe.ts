// routes/safe.ts
import express from 'express';
import  SafeApiKit  from '@safe-global/api-kit';
import  EthersAdapter  from "@safe-global/protocol-kit";
import { ethers } from 'ethers';

const router = express.Router();
const txServiceUrl = 'https://safe-transaction-mainnet.safe.global';

// Store pending transactions (use DB in production)
const pendingSafes = new Map();

router.post('/create', async (req, res) => {
    const { daoId, signers, threshold } = req.body;

    // Initialize Safe SDK
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const signer = provider.getSigner();
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });
    const safeService = new SafeApiKit({ txServiceUrl, ethAdapter });

    // Create Safe deployment config
    const safeAccountConfig = {
        owners: signers,
        threshold,
        // ... other config
    };

    // Predict Safe address
    const safeFactory = await SafeFactory.create({ ethAdapter });
    const safeAddress = await safeFactory.predictSafeAddress(safeAccountConfig);

    // Create deployment transaction
    const safeDeploymentTx = await safeFactory.createSafeDeploymentTransaction(safeAccountConfig);

    // Generate signing URLs
    const baseUrl = process.env.APP_BASE_URL;
    const signingUrls = {
        creator: `${baseUrl}/safe/sign?daoId=${daoId}&signer=${signers[0]}`,
        treasurer: `${baseUrl}/safe/sign?daoId=${daoId}&signer=${signers[1]}`,
        secGen: `${baseUrl}/safe/sign?daoId=${daoId}&signer=${signers[2]}`
    };

    // Store pending transaction
    pendingSafes.set(daoId, {
        safeAddress,
        safeTxHash: safeDeploymentTx.data.safeTxHash,
        transactionData: safeDeploymentTx.data,
        signatures: {}
    });

    res.json({ safeAddress, signingUrls });
});

router.get('/pending', async (req, res) => {
    const { daoId, signer } = req.query;
    const pending = pendingSafes.get(daoId.toString());

    if (!pending) {
        return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({
        transaction: {
            ...pending,
            daoId,
            signer,
            daoName: `DAO ${daoId}` // Get actual name from DB
        }
    });
});

router.post('/sign', async (req, res) => {
    const { daoId, signer, signature, safeTxHash } = req.body;
    const pending = pendingSafes.get(daoId);

    if (!pending || pending.safeTxHash !== safeTxHash) {
        return res.status(400).json({ error: 'Invalid transaction' });
    }

    // Add signature
    pending.signatures[signer] = signature;

    // Check if threshold reached
    if (Object.keys(pending.signatures).length >= pending.threshold) {
        await executeDeployment(pending);
        pendingSafes.delete(daoId);
    }

    res.status(200).send();
});

async function executeDeployment(pending) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const signer = provider.getSigner();
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });

    // Create protocol kit instance
    const safeFactory = await SafeFactory.create({ ethAdapter });
    const safe = await safeFactory.deploySafe({
        safeAccountConfig: pending.safeAccountConfig,
        safeDeploymentConfig: pending.transactionData
    });

    // Associate Safe with DAO in your database
    await daoService.linkSafe(pending.daoId, safe.getAddress());
}