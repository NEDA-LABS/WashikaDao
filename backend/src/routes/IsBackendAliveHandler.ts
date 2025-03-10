import express, { Request, Response } from "express";
import BackendChecker from "../controller/BackendStatusController";
const router = express.Router();

router.get('/CheckBackendStatus', async (req: Request, res: Response) => {
  await BackendChecker(req, res);
});

export default router;
