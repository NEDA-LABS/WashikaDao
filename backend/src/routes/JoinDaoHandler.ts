const router = require('express').Router(); 
const RequestJoinDaoController = require("../controller/RequestJoinDaoController"); 
import { Request, Response } from "express"; 

router.post('/requestJoinDao', (req: Request, res: Response) => RequestJoinDaoController.requestToJoinDao(req, res));  
