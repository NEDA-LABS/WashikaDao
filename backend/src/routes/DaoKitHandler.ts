import express, { Request, Response } from 'express';
const router = express.Router();
import { GetDaoDetailsByMultisig, UpdateDaoDetails, FundDao } from "../controller/DaoController";
//INFO:Handlers in Dao activities such as membership, funding and other within a specific Dao activities


router.get('/:daoMultiSigAddr', async (req: Request, res: Response) => {GetDaoDetailsByMultisig(req, res)}); // Provides all information about a particular Dao
//
//updating dao information
router.put('/:multiSigAddr', async(req: Request, res: Response) => {UpdateDaoDetails(req, res)});//INFO: updating information about a particular Dao, allows for Editing of Dao Details by only authorized members


router.post('/:multiSigAddr/FundDao', async(req: Request, res: Response) => { await  FundDao(req, res)});

export default router;


