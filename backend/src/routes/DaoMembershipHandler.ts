const express = require('express'); 
const router = express.Router();
const CreateDaoController = require("../controller/CreateDaoController"); 
const DaoMembershipController = require("../controller/DaoMembershipController");
import { Request, Response } from "express";
//Adding a particular user to be an owner of a particular dao too 
//TODO: implement this to be a protected route 
router.post('/daoDetails/AddMultisig/:multiSigAddr', (req: Request, res: Response) => DaoMembershipController.AddAnotherMultisigToDao(req, res)); 
//adding a user to member of a particular dao or whitelisting them 
//TODO: implement this to be a protected route, ensure user has enough permissions to access this since it is direct no other checks 
//displaying all members of this dao 
router.get('/daoDetails/:multiSigAddr/members', (req: Request, res: Response) => DaoMembershipController.GetAllMembers(req, res)); 
//adding member to a particular dao
router.post('/daoDetails/:multiSigAddr/members/AddMember/', (req: Request, res: Response) => DaoMembershipController.WhiteListUser(req, res));
//deleting a member from a particular dao or blacklisting them 
router.post('/daoDetails/:multiSigAddr/members/:memberAddr', (req: Request, res: Response) => DaoMembershipController.BlackListMember(req, res)); 

