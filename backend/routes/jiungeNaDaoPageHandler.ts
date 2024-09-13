const router = require('express').Router(); 
const requestJoinDaoController = require("../controllers/requestToJoinDao");
import { Request, Response } from "express"; 

router.post('/requestJoinDao', (req: Request, res: Response) => requestJoinDaoController.requestToJoinDao(req, res));  