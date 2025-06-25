// src/routes/safe.routes.ts
import express from "express";
import {
    initiateSafeCreation,
    getSignerData,
    submitSignature
} from "../controllers/SafeController";
import { verifySignature} from "../middleware/verifySignature";

const router = express.Router();

router.post("/initiate", initiateSafeCreation);
router.get("/signer-data", getSignerData);
router.post("/submit-signature", submitSignature);
router.post("submit-signature", verifySignature, submitSignature);


export default router;









