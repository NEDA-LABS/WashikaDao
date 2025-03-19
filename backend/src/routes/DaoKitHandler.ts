import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();
import { GetDaoDetailsByDaoTxHash,  UpdateDaoDetails } from "../controller/DaoController";

//INFO:Handlers in Dao activities such as get dao info by multisig & updating Dao Details
router.get('/GetDaoDetailsByDaoTxHash',  async (req: Request, res: Response) => {GetDaoDetailsByDaoTxHash(req, res)}); // Provides all information about a particular Dao

//updating dao information
router.put('/UpdateDaoDetails',  async(req: Request, res: Response) => {UpdateDaoDetails(req, res)});//INFO: updating information about a particular Dao, allows for Editing of Dao Details by only authorized members


export default router;


