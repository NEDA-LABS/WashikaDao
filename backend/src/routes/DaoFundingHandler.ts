import express, { Request, Response } from 'express';
const router = express.Router();
import { GetAllDaoFunds } from "../controller/DaoController";
import { FundDao } from "../controller/DaoController";



//TODO: Add more logic for money management within the Dao setting things like interest rates and all these other regulations
router.get('/AllFunds', (req: Request, res: Response) => GetAllDaoFunds(req, res));//Obtaining all the funds in the dao


router.post('/FundDao', async (req: Request, res: Response) => {FundDao(req, res)});


export default router;


