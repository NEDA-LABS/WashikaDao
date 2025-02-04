import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();
import { GetDaoDetailsByMultisig, UpdateDaoDetails } from "../controller/DaoController";
import { Authenticator } from '../utils/Authenticator/Authenticator';

//INFO:Handlers in Dao activities such as get dao info by multisig & updating Dao Details
router.get('/GetDaoDetailsByMultisig', async (req: Request, res: Response) => {GetDaoDetailsByMultisig(req, res)}); // Provides all information about a particular Dao

//updating dao information
router.post('/UpdateDaoDetails', Authenticator, async(req: Request, res: Response, next: NextFunction) => {UpdateDaoDetails(req, res)});//INFO: updating information about a particular Dao, allows for Editing of Dao Details by only authorized members



export default router;


