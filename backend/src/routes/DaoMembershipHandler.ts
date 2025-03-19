import express, { Request, Response } from "express";
const router = express.Router();


import { handleSendInviteSMS } from "../controller/SMSController";

/**
/**
    * INFO: Sends an invite to Join Dao via SMS
    * @Params - Multisig of the Dao
    * @request Body - Details of the Member to issue invite to, must include the phone number since this is an SMS
    * @returns - Status code & or error  message
    */
router.post('/InviteMemberSMS',  (req: Request, res: Response) => handleSendInviteSMS(req, res));

export default router;
//TODO: add middleware to check if user is an owner of the dao or has sufficient permissions to access the endpoint
