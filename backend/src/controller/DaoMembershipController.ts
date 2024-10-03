import { eventNames } from "process";
//import { daoContract, publicClient } from "./config.ts";
import { Request, Response } from "express";
const Dao = require("../entity/Dao");
const Proposal = require("../entity/Proposal"); 
const Vote = require("../entity/Vote");
const MemberDetails = require("../entity/MemberDetails");
import { AppDataSource } from "../data-source";  
import { IDao, IMemberDetails } from "../Interfaces/EntityTypes";
import { ObjectLiteral } from "typeorm";

const memberDetailsRepository = AppDataSource.getRepository(MemberDetails)
const daoRepository = AppDataSource.getRepository(Dao);  

/**
 * Adds a new multisig address to a DAO.
 *
 * @param req - The Express request object containing the parameters and body.
 * @param res - The Express response object to send the HTTP response.
 *
 * @remarks
 * This function is responsible for adding a new multisig address to a DAO.
 * It retrieves the DAO's multiSigAddr from the request parameters and the addressToAdd from the request body.
 * It then finds the DAO by its multiSigAddr, checks if the required parameters are provided, and adds the new multisig address to the DAO.
 *
 * @returns
 * - If the required parameters are missing, it returns a 400 status code with an error message.
 * - If the DAO is not found, it returns a 404 status code with an error message.
 * - If the new multisig address is successfully added, it returns a 200 status code with a success message.
 * - If any other error occurs, it returns a 400 status code with the error message.
 */
export async function AddAnotherMultisigToDao(req: Request, res: Response) {
    const { _daoMultiSigAddr } = req.params;//dao to add multisig address, process of adding new owner  
    if (!_daoMultiSigAddr) {
        return res.status(400).json({ error: 'Missing required daoMultiSigAddr' })
    }
    const { addressToAdd } = req.body;  
    if (!addressToAdd) {
        return res.status(400).json({ error: 'Missing required addressToAdd' })
    }
    try {
        //find dao by multiSigAddr 
        const daoDetails: IDao | ObjectLiteral = await memberDetailsRepository.findOneBy({ daoMultiSig: _daoMultiSigAddr });
        if (!daoDetails || daoDetails.daoMultiSig === undefined) {
            return res.status(404).json({ error: 'DAO not found' });
        }
        //add the new owner to the dao, multisigs are part of the dao details 
         await daoDetails.daoMultiSigs[_daoMultiSigAddr].push(addressToAdd); 
        await daoDetails.update(daoDetails);  
        return res.status(200).json({ message: 'Added ' + addressToAdd + 'successfully' }); 
    } catch (error) {
        return res.status(400).json({ error: error.message})
    }
}

/**
 * Handles the request to join a DAO.
 *
 * @param req - The Express request object containing the parameters and body.
 * @param res - The Express response object to send the HTTP response.
 *
 * @remarks
 * This function is responsible for processing a request to join a DAO.
 * It retrieves the DAO's multiSigAddr from the request parameters and the necessary details from the request body.
 * It then checks if the required parameters are provided, finds the DAO by its multiSigAddr, and sends a request to join the DAO.
 *
 * @returns
 * - If the required parameters are missing, it returns a 400 status code with an error message.
 * - If the DAO is not found, it returns a 404 status code with an error message.
 * - If the request to join the DAO is successfully sent, it returns a 201 status code with a success message.
 * - If any other error occurs, it returns a 500 status code with the error message.
 */
export async function RequestToJoinDao (req: Request, res: Response){
    const { _daoMultiSigAddr } = req.params; 
    // @ts-ignore: Destructuring values from incoming form data
    // const {_firstName, _lastName, _email, _password, _requesterAddr, _role,  } = req.body;
    // I am not sure this is the best way to get the password but the frontend should hash it, the above is more on the account creation page & details.
    const { _fullName, _phoneNo, _role, _nationalIdNo, _requesterAddr}  = req.body; //for the db 

    if (!_daoMultiSigAddr) {
        try {
            // Check if the regNo is mapped to a multisig. If true, map it to multisig. Otherwise, throw an error, no such DAO to join.
        } catch (error) {
            return res.status(500).json({ error: error.message });  // Internal server error
        }
    }

    if (!_daoMultiSigAddr || !_requesterAddr || !_role) {
        return res.status(400).json({ error: 'Missing required' })
    }

    // Adding them to the DAO members registry
    try {
        const findDaoByMultiSig = await memberDetailsRepository.findOneBy({ daoMultiSigAddr: _daoMultiSigAddr });
        // Return error if DAO not found
        if (!findDaoByMultiSig) {
            return res.status(404).json({ error: 'DAO not found' });
        } 

        // Send request for the address to be added to the whitelist 

        res.status(201).json({ message: 'Request sent to join DAO successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending request to join DAO' });
    }
}
//TODO: add registry for whitelist 

/**
 * Adds a new member to a DAO's whitelist.
 *
 * @param req - The Express request object containing the parameters and body.
 * @param res - The Express response object to send the HTTP response.
 *
 * @remarks
 * This function is responsible for adding a new member to a DAO's whitelist.
 * It retrieves the DAO's multiSigAddr from the request parameters and the member details from the request body.
 * It then checks if the required parameters are provided, finds the DAO by its multiSigAddr, and adds the new member to the whitelist.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {string} req.params._daoMultiSig - The multiSigAddr of the DAO to add the member to.
 * @param {typeof MemberDetails} req.body - The details of the member to be added.
 *
 * @returns {Response}
 * - If the required parameters are missing, it returns a 400 status code with an error message.
 * - If the DAO is not found, it returns a 404 status code with an error message.
 * - If the member is successfully added to the whitelist, it returns a 200 status code with a success message.
 * - If any other error occurs, it returns a 500 status code with the error message.
 */
export async function WhiteListUser(req: Request, res: Response) {
    const { _daoMultiSig } = req.params; 
    const memberDetails: typeof MemberDetails = req.body; 
    if (!(memberDetails.contains(memberDetails._fullName))) {
        return res.status(400).json({ error: 'missing required' })
    } 
       try { 
        const daoToBeAddedTo = await daoRepository.findOneBy({ daoMultiSigAddr: _daoMultiSig });        if (!daoToBeAddedTo || daoToBeAddedTo === undefined || daoToBeAddedTo === null) {
            return res.status(404).json({ error: 'DAO not found' });
        }
        //constructing the members
        const createdMember = memberDetailsRepository.create(memberDetails); 
        //saving the created member 
        await memberDetailsRepository.save(createdMember); 
        //add the member to the dao 
        await daoRepository.update(Dao, createdMember); 
        return res.status(200).json({ message: 'Member added successfully/ whitelist success' }); 
    }  catch (error) {
        res.status(500).json({ error: 'Error adding member'})
    }
}

//function to delete a member from the dao 
/**
 * Deletes a member from a DAO's whitelist.
 *
 * @remarks
 * This function retrieves the DAO's multiSigAddr and the address of the member to be deleted from the request parameters.
 * It then checks if the required parameters are provided, finds the DAO by its multiSigAddr, and deletes the member from the whitelist.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {string} req.params.multiSigAddr - The multiSigAddr of the DAO from which to delete the member.
 * @param {string} req.params.addressToDelete - The address of the member to be deleted.
 *
 * @returns {Response}
 * - If the required parameters are missing, it returns a 400 status code with an error message.
 * - If the DAO is not found, it returns a 404 status code with an error message.
 * - If the member is successfully deleted from the whitelist, it returns a 200 status code with a success message.
 * - If any other error occurs, it returns a 500 status code with the error message.
 */
export async function BlackListMember(req: Request, res: Response) {
    const { multiSigAddr, addressToDelete } = req.params;//dao to delete user from
    if (!multiSigAddr ||!addressToDelete) {
        return res.status(400).json({ error: 'Missing required' })
    } 
    try {
        // Retrieve the DAO first
        const daoDetails = await daoRepository.findOneBy({ daoMultiSigAddr: multiSigAddr });        if (!daoDetails ||!daoDetails.multiSigAddr === undefined) {
            return res.status(404).json({ error: 'DAO not found' });
        } 

        // Find the member by the address
        const memberToDelete = await memberDetailsRepository.findOne({ where : { addressToDelete }}) 
        if (!memberToDelete || daoDetails.members.some(m => m.memberId === memberToDelete.memberId)) { 
            return res.status(404).json({ message: `Member with address ${addressToDelete}` });
        } 
        // Remove the member from the DAO's list of members
        daoDetails.members = daoDetails.members.filter(m => m.memberId !== memberToDelete.memberId); 
        // Update the DAO
        await daoRepository.save(daoDetails); 
        return res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error Occurred When Deleting Member' });
    }
}

/**
 * Retrieves all members associated with a specific DAO.
 *
 * @remarks
 * This function retrieves the multiSigAddr from the request parameters and fetches all members associated with the DAO.
 * It checks if the required parameter is provided and fetches the DAO details using the multiSigAddr.
 * If the DAO is found, it returns a list of members associated with the DAO.
 * If any error occurs during the process, it returns an appropriate error message.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {string} req.params.multiSigAddr - The multiSigAddr of the DAO for which to retrieve members.
 *
 * @returns {Response}
 * - If the required parameter is missing, it returns a 400 status code with an error message.
 * - If the DAO is not found, it returns a 400 status code with an error message.
 * - If the members are successfully retrieved, it returns a 200 status code with a list of members.
 * - If any other error occurs, it returns a 500 status code with the error message.
 */
export async function GetAllMembers(req: Request, res: Response) {
    const { multiSigAddr } = req.params;
    if (!multiSigAddr) {
        return res.status(400).json({ error: 'Missing required' });
    }
    try {
        const daoDetails = await daoRepository.findOne({ where: { multiSigAddr }, relations: ["members"] });

        if (!daoDetails || !daoDetails.multiSigAddr) {
            return res.status(400).json({ error: 'Error locating DAO' });
        }

        return res.status(200).json({ members: daoDetails.members });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error Occurred When Fetching Members' });
    }
}
