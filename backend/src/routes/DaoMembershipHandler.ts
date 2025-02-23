import express, { Request, Response } from "express";
const router = express.Router();

import { GetAllMembers, RequestToJoinDao, WhiteListUser, BlackListMember, AddMember } from "../controller/DaoMembershipController";
import { handleSendInviteSMS } from "../controller/SMSController";
import { Authenticator }  from "../utils/Authenticator/Authenticator";

/**
 * @ Remarks: The only ownership activities available are creating a new owner to allow for ownership transfer & adding another multisig to a dao & adding a user to a particular Dao
 */

//Adding a particular user to be an owner of a particular dao too
//TODO: implement this to be a protected route, ensure user has enough permissions to access this since it is direct no other checks ---now resolved
/** Dao MemberShip Activities available  **/
/**
    * INFO: Gets all the members of a particular Dao
    * The multisig of the dao is passed as url params
    * @returns a Json Array Object containing an array of all the members of a DAO
    */

router.get('/AllDaoMembers', Authenticator, (req: Request, res: Response) => {GetAllMembers(req, res)});
/**
    * INFO: Sends a Request to Join a particular Dao
    * @params The multisig of the Dao to send request to
    * @request Body - The Necessary Details of the member who wants to join
    * @returns a success or failed status code & or message
    */
router.post('/RequestToJoinDao', (req: Request, res: Response) => {RequestToJoinDao(req, res)});
/**
    * INFO: Add a member to a particular Dao
    * @Params - Multisig of the Dao
    * @request Body - Member Details to add
    * @returns - a success code or error message
    */
router.post('/AddMember', Authenticator, (req: Request, res: Response) =>  { AddMember(req, res) });//INFO: add member to a certain dao
/**
    * INFO: Updates the Details of a member of a particular Dao
    * @Params - Multisig of the Dao
    * @request Body - Member Details to Update
    * @returns - a success code or error message
    */
router.patch('/WhiteListMember', Authenticator, (req: Request, res: Response) =>  { WhiteListUser(req, res) });//INFO: update member to a certain rank or sth else
/**
    * INFO: Adds Member to Dao Black list
    * @Params - Multisig of the Dao
    * @request Body - Member Details to Add to Blacklist
    * @returns - success code & message or member not found error or failed to blacklist error
    */
router.patch('/BlackListMember', Authenticator, (req: Request, res: Response) => { BlackListMember(req, res)});
/**
/**
    * INFO: Sends an invite to Join Dao via SMS
    * @Params - Multisig of the Dao
    * @request Body - Details of the Member to issue invite to, must include the phone number since this is an SMS
    * @returns - Status code & or error  message
    */
router.post('/InviteMemberSMS', Authenticator, (req: Request, res: Response) => handleSendInviteSMS(req, res));

export default router;
//TODO: add middleware to check if user is an owner of the dao or has sufficient permissions to access the endpoint
