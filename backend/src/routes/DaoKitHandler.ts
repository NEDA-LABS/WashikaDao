import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();
import { GetDaoDetailsByMultisig, GetMemberDaos, UpdateDaoDetails } from "../controller/DaoController";
import { Authenticator } from '../utils/Authenticator/Authenticator';

//INFO:Handlers in Dao activities such as get dao info by multisig & updating Dao Details
router.get('/GetDaoDetailsByMultisig', Authenticator, async (req: Request, res: Response) => {GetDaoDetailsByMultisig(req, res)}); // Provides all information about a particular Dao

//updating dao information
router.put('/UpdateDaoDetails', Authenticator, async(req: Request, res: Response) => {UpdateDaoDetails(req, res)});//INFO: updating information about a particular Dao, allows for Editing of Dao Details by only authorized members

router.get('/getMemberDaos', async(req: Request, res: Response) => {GetMemberDaos(req, res)});

export default router;


