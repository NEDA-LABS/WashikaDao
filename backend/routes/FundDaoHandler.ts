const router = require('express').Router(); 
import { Request, Response } from 'express'; 
const createDaoController = require("../controllers/createDao");

router.post('/FundDao/:funderAddr/:multiSigAddr', (req: Request, res: Response) => createDaoController.FundDao(req, res));