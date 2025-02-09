import express, { Request, Response } from 'express';
const router = express.Router();
import { GetAllDaoFunds } from "../controller/DaoController";
import { FundDao } from "../controller/DaoController";
import {Authenticator} from '../utils/Authenticator/Authenticator';



//TODO: Add more logic for money management within the Dao setting things like interest rates and all these other regulations
router.get('/AllFunds', Authenticator, (req: Request, res: Response) => GetAllDaoFunds(req, res));//Obtaining all the funds in the dao


router.post('/FundDao', Authenticator,  (req: Request, res: Response) => {FundDao(req, res)});


export default router;


