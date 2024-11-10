const express = require('express');
const router = express.Router();
const DaoController = require("../controller/DaoController");
const DaoMembershipController = require("../controller/DaoMembershipController");
import { Request, Response } from "express";

//Creatint the initial Owner of a Dao
router.post('/DaoDetails/CreateOwner', (req: Request, res: Response) => DaoMembershipController.CreateInitialOwner(req, res))
//Logging in user
router.post('/DaoDetails/login', (req: Request, res: Response) => DaoMembershipController.loginMember(req, res))
//Adding a particular user to be an owner of a particular dao too 
//TODO: implement this to be a protected route 
router.post('/DaoDetails/AddMultisig/:multiSigAddr', (req: Request, res: Response) => DaoMembershipController.AddAnotherMultisigToDao(req, res)); 
//adding a user to member of a particular dao or whitelisting them 
//TODO: implement this to be a protected route, ensure user has enough permissions to access this since it is direct no other checks 
router.post('/DaoDetails/:multiSigAddr/AddMember', (req: Request, res: Response) => DaoMembershipController.RequestToJoinDao(req, res));
//displaying all members of this dao 
router.get('/DaoDetails/:multiSigAddr/members', (req: Request, res: Response) => DaoMembershipController.GetAllMembers(req, res)); 
//adding member to a particular dao
router.post('/DaoDetails/:multiSigAddr/members/AddMember', (req: Request, res: Response) => DaoMembershipController.WhiteListUser(req, res));
//deleting a member from a particular dao or blacklisting them
router.post('/DaoDetails/:multiSigAddr/members/:memberAddr', (req: Request, res: Response) => DaoMembershipController.BlackListMember(req, res));

module.exports = router ;
//TODO: add middleware to check if user is an owner of the dao or has sufficient permissions to access the endpoint
