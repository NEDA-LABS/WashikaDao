const express = require('express');
const router = express.Router();
import DaoController = require("../controller/DaoController");
import EmailController = require("../controller/EmailController");
import SMSController = require("../controller/SMSController");
import DaoMembershipController = require("../controller/DaoMembershipController");
import { Request, Response } from "express";
import { authenticator } from "../utils/Authenticator/Authenticator";

//Creatint the initial Owner of a Dao
router.post('/DaoDetails/CreateOwner', (req: Request, res: Response) => DaoMembershipController.CreateInitialOwner(req, res))
//Logging in user
router.post('/DaoDetails/login', (req: Request, res: Response) => DaoMembershipController.loginMember(req, res))
//Adding a particular user to be an owner of a particular dao too
//TODO: implement this to be a protected route   ---now resolved
router.post('/DaoDetails/AddMultisig/:multiSigAddr', authenticator, (req: Request, res: Response) => DaoMembershipController.AddAnotherMultisigToDao(req, res));
//adding a user to member of a particular dao or whitelisting them
//TODO: implement this to be a protected route, ensure user has enough permissions to access this since it is direct no other checks ---now resolved
router.post('/DaoDetails/:multiSigAddr/AddMember', (req: Request, res: Response) => DaoMembershipController.RequestToJoinDao(req, res));
//displaying all members of this dao
router.get('/DaoDetails/:daoMultiSigAddr/members', (req: Request, res: Response) => DaoMembershipController.GetAllMembers(req, res));
//adding member to a particular dao
router.post('/DaoDetails/:multiSigAddr/members/AddMember', authenticator, (req: Request, res: Response) => DaoMembershipController.WhiteListUser(req, res));
//deleting a member from a particular dao or blacklisting them
router.post('/DaoDetails/:multiSigAddr/members/:memberAddr', authenticator, (req: Request, res: Response) => DaoMembershipController.BlackListMember(req, res));
router.post('/DaoDetails/inviteMemberEmail', authenticator, (req: Request, res: Response) => EmailController.handleSendInvite(req, res)); 
router.post('/DaoDetails/inviteMemberSMS', authenticator, (req: Request, res: Response) => SMSController.handleSendInviteSMS(req, res)); 

module.exports = router ;
//TODO: add middleware to check if user is an owner of the dao or has sufficient permissions to access the endpoint
