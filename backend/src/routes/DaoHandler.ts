const router = require('express').Router();
const CreateDaoController = require("../controller/CreateDaoController"); 
import { Request, Response } from "express";

//Views -> To the React
//TODO: Refactor to handle returning json data so that the client can consume
router.post('/createDao', (req: Request, res: Response) => CreateDaoController.createNewDao(req, res));
router.get('/insideDao/:multiSigAddr', (req: Request, res: Response) => CreateDaoController.getDaoDetails(req, res));
router.post('/FundDao/:funderAddr/:multiSigAddr', (req: Request, res: Response) => CreateDaoController.FundDao(req, res));
router.put('/insideDao/:multiSigAddr', (req: Request, res: Response) => CreateDaoController.updateDaoDetails(req, res));
