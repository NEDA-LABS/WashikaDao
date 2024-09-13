const router = require('express').Router();
const createDaoController = require("../controllers/createDao");
import { Request, Response } from "express";

//Views -> To the React
//TODO: Refactor to handle returning json data so that the client can consume
router.post('/createDao', (req: Request, res: Response) => createDaoController.createNewDao(req, res));
router.get('/insideDao/:multiSigAddr', (req: Request, res: Response) => createDaoController.getDaoDetails(req, res));
router.post('/FundDao/:funderAddr/:multiSigAddr', (req: Request, res: Response) => createDaoController.FundDao(req, res));
router.put('/insideDao/:multiSigAddr', (req: Request, res: Response) => createDaoController.updateDaoDetails(req, res));