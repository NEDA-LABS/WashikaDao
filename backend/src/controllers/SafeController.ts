// src/controllers/safe.controllers.ts
import { Request, Response } from "express";
import { SafeService } from "../services/multisig/safeService";

const safeService = new SafeService();

export const initiateSafeCreation = async (req: Request, res: Response) => {
    try {
        const { daoId, signers, threshold = 2 } = req.body;
        const result = await safeService.initiateSafeCreation(daoId, signers, threshold);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getSignerData = async (req: Request, res: Response) => {
    try {
        const token = req.query.token as string;
        const data = await safeService.getSignerData(token);
        res.json(data);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const submitSignature = async (req: Request, res: Response) => {
    try {
        const { token, signature } = req.body;
        const result = await safeService.submitSignature(token, signature);

        if (result.status === "deployed") {
            res.status(202).json(result);
        } else {
            res.status(200).json(result);
        }
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};