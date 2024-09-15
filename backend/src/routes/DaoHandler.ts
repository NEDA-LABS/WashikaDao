const express = require('express'); 
const router = express.Router();
const CreateDaoController = require("../controller/CreateDaoController"); 
const DaoMembershipController = require("../controller/DaoMembershipController");
import { Request, Response } from "express";
/**
 * Handles the creation of a new DAO.
 *
 * @remarks
 * This route is responsible for processing a POST request to create a new DAO.
 * The request body should contain the necessary information to initialize the DAO.
 *
 * @param req - The Express request object containing the incoming request data.
 * @param res - The Express response object used to send a response back to the client.
 *
 * @returns {void} - This function does not return a value.
 * It sends a response back to the client indicating the success or failure of the DAO creation process.
 */
router.post('/createDao', (req: Request, res: Response) => CreateDaoController.CreateNewDao(req, res));
//user searches for dao information using multisig address, any multisig of a dao can be used to display its details. 
router.get('/daoDetails/:multiSigAddr', (req: Request, res: Response) => CreateDaoController.GetDaoDetailsByMultisig(req, res));
//updating dao information
router.put('/daoDetails/:multiSigAddr', (req: Request, res: Response) => CreateDaoController.UpdateDaoDetails(req, res));
router.post('/daoDetails/FundDao/:multiSigAddr', (req: Request, res: Response) => CreateDaoController.FundDao(req, res));
