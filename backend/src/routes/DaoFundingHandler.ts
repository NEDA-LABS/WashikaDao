import express, { Request, Response } from 'express';
const router = express.Router();
import { GetAllDaoFunds } from "../controller/DaoController";
import { FundDao } from "../controller/DaoController";



//TODO: Add more logic for money management within the Dao setting things like interest rates and all these other regulations
router.get('/:multiSigAddr/Funding', (req: Request, res: Response) => GetAllDaoFunds(req, res));//Obtaining all the funds in the dao


router.post('/:multiSigAddr/Funding/FundDao', async (req: Request, res: Response) => {
   await  FundDao(req, res)});


export default router;
