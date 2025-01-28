import express, { Express, Request, Response } from "express";
const router = express.Router();
import  * as DaoController from "../controller/DaoController";
import * as  EmailController from "../controller/EmailController";
import  * as SMSController from "../controller/SMSController";
import * as DaoMembershipController from "../controller/DaoMembershipController";
//import { authenticator } from "../utils/Authenticator/Authenticator";

import { CreateInitialOwner, AddAnotherMultisigToDao, GetAllMembers, RequestToJoinDao, WhiteListUser, BlackListMember } from "../controller/DaoMembershipController";
import { handleSendInvite } from "../controller/EmailController";
import { handleSendInviteSMS } from "../controller/SMSController";
/** Dao Ownership Management Activities available **/
// @ts-ignore
/**
 * @ Remarks: The only ownership activities available are creating a new owner to allow for ownership transfer & adding another multisig to a dao & adding a user to a particular Dao
 */
//Creatint the initial Owner of a Dao

// @ts-ignore
router.post('/:multiSigAddr/CreateOwner', (req: Request, res: Response) => CreateInitialOwner(req, res))
//Adding a particular user to be an owner of a particular dao too
//TODO: implement this to be a protected route   ---now resolved
// @ts-ignore
router.post('/:multiSigAddr/AddMultisig', (req: Request, res: Response) => AddAnotherMultisigToDao(req, res));
//adding a user to member of a particular dao or whitelisting them
//TODO: implement this to be a protected route, ensure user has enough permissions to access this since it is direct no other checks ---now resolved
/** Dao MemberShip Activities available  **/
// @ts-ignore
router.get('/:daoMultiSigAddr/Membership/AllMembers', (req: Request, res: Response) => GetAllMembers(req, res));
// @ts-ignore
router.post('/:multiSigAddr/Membership/:userAddr/RequestToJoinDao', (req: Request, res: Response) => RequestToJoinDao(req, res));
//displaying all members of this dao
// @ts-ignore
router.post('/:multiSigAddr/Membership/UpdateMember', (req: Request, res: Response) => WhiteListUser(req, res));//INFO: update member to a certain rank or sth else
//deleting a member from a particular dao or blacklisting them
// @ts-ignore
router.post('/:multiSigAddr/Membership/:memberAddr', (req: Request, res: Response) => BlackListMember(req, res));
router.post('/:multiSigAddr/MemberShip/inviteMemberEmail', (req: Request, res: Response) => handleSendInvite(req, res));
router.post('/:multiSigAddr/Membership/inviteMemberSMS', (req: Request, res: Response) => handleSendInviteSMS(req, res));

export default router;
//TODO: add middleware to check if user is an owner of the dao or has sufficient permissions to access the endpoint
