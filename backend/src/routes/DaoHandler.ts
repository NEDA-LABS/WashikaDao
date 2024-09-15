const express = require('express'); 
const router = express.Router();
const CreateDaoController = require("../controller/CreateDaoController"); 
const DaoMembershipController = require("../controller/DaoMembershipController");
import { Request, Response } from "express";

//Views -> To the React
//TODO: Refactor to handle returning json data so that the client can consume 
//user wants to create a dao 
router.post('/createDao', (req: Request, res: Response) => CreateDaoController.CreateNewDao(req, res));
//user searches for dao information using multisig address, any multisig of a dao can be used to display its details. 
router.get('/daoDetails/:multiSigAddr', (req: Request, res: Response) => CreateDaoController.GetDaoDetailsByMultisig(req, res));
//updating dao information
router.put('/daoDetails/:multiSigAddr', (req: Request, res: Response) => CreateDaoController.UpdateDaoDetails(req, res));
router.post('/daoDetails/FundDao/:multiSigAddr', (req: Request, res: Response) => CreateDaoController.FundDao(req, res));
