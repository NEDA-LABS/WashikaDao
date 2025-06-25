// src/middleware/verifySignature.ts
import { Request, Response, NextFunction } from "express";
import { ethers } from "ethers";

export const verifySignature = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { signature } = req.body;
        const token = req.body.token;

        // Get signer address from token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const signerAddress = decoded.signer;

        // Get transaction hash from database
        const pendingSafeRepo = getRepository(PendingSafe);
        const pendingSafe = await pendingSafeRepo.findOne({
            where: { safeAddress: decoded.safeAddress }
        });

        if (!pendingSafe) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        // Verify signature
        const recoveredAddress = ethers.utils.verifyMessage(
            ethers.utils.arrayify(pendingSafe.safeTxHash),
            signature
        );

        if (recoveredAddress.toLowerCase() !== signerAddress.toLowerCase()) {
            return res.status(401).json({ error: "Signature verification failed" });
        }

        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid signature" });
    }
};







