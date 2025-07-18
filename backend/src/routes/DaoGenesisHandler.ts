import express, { Express } from 'express';
import { Request, Response } from "express";
import { CreateDao, GetAllDaosInPlatform } from '../controllers/DaoController';
const router = express.Router();


router.post('/CreateDao', async (req: Request, res: Response) =>{await CreateDao(req, res)});//INFO: Unique route that is only used for creating Daos

router.get('/GetAllDaos',  async (req: Request, res: Response) => {await GetAllDaosInPlatform(req, res)});//INFO: provides all the available Daos within the application, used for rendering say a certain no of daos & extended to more dao viewing functionality within the client

export default router;

