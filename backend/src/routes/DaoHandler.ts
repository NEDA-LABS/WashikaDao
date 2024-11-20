const express = require('express'); 
const router = express.Router();
const DaoController = require('../controller/DaoController'); 
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
router.post('/CreateDao', (req: Request, res: Response) => DaoController.CreateNewDao(req, res));
//user searches for dao information using multisig address, any multisig of a dao can be used to display its details. 
router.get('/DaoDetails/:daoMultiSigAddr', (req: Request, res: Response) => DaoController.GetDaoDetailsByMultisig(req, res));
router.get('/GetDaoDetails', (req: Request, res: Response) => DaoController.GetAllDaoDetails(req, res));
//implement inside url later speed for now
//router.get('/DaoDetails', (req: Request, res: Response) => DaoController.GetDaoDetailsByMultisig(req, res));
//updating dao information
router.put('/DaoDetails/:multiSigAddr', (req: Request, res: Response) => DaoController.UpdateDaoDetails(req, res));
router.post('/DaoDetails/FundDao/:multiSigAddr', (req: Request, res: Response) => DaoController.FundDao(req, res));


module.exports = router ;
