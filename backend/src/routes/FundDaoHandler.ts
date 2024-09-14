const router = require('express').Router(); 
import { Request, Response } from 'express'; 
const CreateDaoController = require("../controller/CreateDaoController"); 

router.post('/FundDao/:funderAddr/:multiSigAddr', (req: Request, res: Response) => CreateDaoController.FundDao(req, res));
