//import { daoContract, publicClient } from "./config.ts";
import { Request, Response } from "express";
//const Dao = require("../entity/Dao");
import { Dao } from "../entity/Dao";
import { AppDataSource } from "../data-source"; 
import { MemberDetails } from "../entity/MemberDetails";

/**
 * Creates a new DAO (Decentralized Autonomous Organization) and saves its details to the database.
 * It also creates a new member detail for the creator of the DAO.
 *
 * @param req - The Express request object containing the DAO and member details in the request body.
 * @param res - The Express response object to send back the HTTP response.
 *
 * @remarks
 * The function extracts the DAO and member details from the request body, validates them,
 * and saves them to the database. It handles errors and returns appropriate HTTP responses.
 *
 * @returns
 * - HTTP 201: If the DAO and member details are successfully created and saved.
 * - HTTP 400: If any required fields are missing in the request body.
 * - HTTP 500: If an error occurs while creating or saving the DAO and member details.
 */
export async function CreateNewDao (req: Request, res: Response) {
    //extracting details of dao from request body 
    const _daoName = req.body; 
    const _daoLocation:string = req.body; 
    const _targetAudience: string = req.body;
    const _daoTitle: string = req.body;
    const _daoDescription: string = req.body;
    const _daoOverview: string = req.body;
    const _daoImageIpfsHash: string = req.body;
    const _multiSigAddr: string = req.body;

    //logging to see the data go 
    console.log(`Extracted the following details from the request body ${_daoName}, ${_daoLocation}, ${_targetAudience}, ${_daoTitle}, ${_daoDescription}, ${_daoOverview}, ${_daoImageIpfsHash}, ${_multiSigAddr}`);
    console.log(JSON.stringify(req.body, null, 2));// a cleaner way? 
    //extracting details of dao members from request body
    //const { _daoName, _daoLocation, _targetAudience, _daoTitle, _daoDescription, _daoOverview, _daoImageIpfsHash, _multiSigAddr } = req.body;
    //check if all required fields are provided for step 1 
    if (!_daoName ||!_daoOverview || !_daoImageIpfsHash || !_daoLocation|| !_targetAudience || !_daoTitle || !_daoDescription || !_multiSigAddr) {
        return res.status(400).json({ error: 'Missing required Dao Details' })
    }
    if (_multiSigAddr === undefined) {
        res.status(404).json({ error: 'Unable to extract correct data type' }); 
        console.log("Failed to extract data type")
    }
    //extracting details of dao members from request body 
    const { _memberName, _phoneNo, _nationalIdNo, _memberRole, _daoMultiSig } = req.body; 
    //checking if all required fields for memberDetails are provided 
    if (!_memberName || !_phoneNo || !_nationalIdNo || !_memberRole || !_daoMultiSig) {
        return res.status(400).json({error: 'Missing required Member Details'})
    }


    try {
        //saving the DAO details to the database
        const dao = new Dao();
        dao.daoName = _daoName;
        dao.daoLocation = _daoLocation;
        dao.targetAudience = _targetAudience;
        dao.daoTitle = _daoTitle;
        dao.daoDescription = _daoDescription;
        dao.daoOverview = _daoOverview;
        dao.daoImageIpfsHash = _daoImageIpfsHash;
        //pushing the multisig address to the array of multisig addresses but in our case it will be the first multisig since we are creating a dao  
        dao.daoMultiSigs = _multiSigAddr; 
        dao.daoMultiSigAddr = _multiSigAddr;

        const daoRepository = AppDataSource.getRepository(Dao);
          //now save the dao to the database
          await daoRepository.save(dao); //saving to db
          res.status(201).json({ message: 'DAO created successfully' })
          console.log("saved to dao repository successfully")
      }  catch (error) { 
            console.error(error);  // logging the error to the console
            res.status(500).json({ error: 'Error Creating DAO' })
          }
        
          try {

                 //creating a new member details object and setting the dao multi sig and member address 
        const memberDetails = new MemberDetails();
        //memberId will autogenerate  
        memberDetails.memberName = _memberName;
        memberDetails.phoneNumber = _phoneNo;
        memberDetails.nationalIdNo = _nationalIdNo;
        memberDetails.memberRole = 'Owner';
        memberDetails.daoMultiSig = _multiSigAddr;
        memberDetails.memberAddr = _multiSigAddr; //requester is the person who created the dao, but in this case it is not used 
        //saving the member details to the database 
        const memberDetailsRepository = AppDataSource.getRepository(MemberDetails);
        console.log(memberDetailsRepository);
        await memberDetailsRepository.save(memberDetails); //saving to db
        //res.status(200).json({message: 'member saved successfully'});//member who created the dao successfully 
        console.log(memberDetails, "Saved to member details repository")
          } catch (error) {
            console.error(error);  // logging the error to the console
            res.status(500).json({ error: 'Error Adding member to dao' })
          }
        
        }

export async function GetDaoDetailsByMultisig (req: Request, res: Response) {
    const daoMultiSigAddr: string = req.params.daoMultiSigAddr;
    try {


        const daoRepository = AppDataSource.getRepository(Dao);
        const daoDetails = await daoRepository.findOneBy({ daoMultiSigAddr });

        if (typeof daoDetails !== undefined && daoDetails !== null) {
           // res.json(daoDetails);
            res.status(200).json({message: 'successfully found dao details', daoDetails});
        } 
    } catch (error) {
        res.status(500).json({ error: 'Error finding Dao' })
    }
}

/**
 * Updates the details of an existing DAO (Decentralized Autonomous Organization) in the database.
 *
 * @param req - The Express request object containing the DAO multi-signature address and updated details in the request parameters and body.
 * @param res - The Express response object to send back the HTTP response.
 *
 * @remarks
 * The function extracts the multi-signature address and updated details from the request parameters and body.
 * It validates the required fields, fetches the DAO details from the database, and updates them.
 * It handles errors and returns appropriate HTTP responses.
 *
 * @returns
 * - HTTP 200: If the DAO details are successfully updated.
 * - HTTP 400: If any required fields are missing in the request parameters or body.
 * - HTTP 404: If the DAO with the given multi-signature address is not found.
 * - HTTP 500: If an error occurs while updating the DAO details.
 */
export async function UpdateDaoDetails(req: Request, res: Response) {
    const { multiSigAddr } = req.params; 
    if (!multiSigAddr) {
        return res.status(400).json({ error: 'Missing required url params' })  //return 400 status if required fields are missing
    }
    const { _daoName, _daoLocation, _targetAudience, _daoTitle, _daoDescription, _daoOverview, _daoImageIpfsHash } = req.body;
    //so you have to manually update all the details if you are updating details 
    //check missing details 
    //TODO: Refactor to an extensible function to check missing required
    if (!multiSigAddr || !_daoName || !_daoLocation || !_targetAudience || !_daoTitle || !_daoDescription || !_daoOverview || !_daoImageIpfsHash ) {
        return res.status(400).json({ error: 'Missing required in form details' })  //return 400 status if required fields are missing
    }

    try {

        const daoRepository = AppDataSource.getRepository(Dao);
        const daoDetails = await daoRepository.findOneBy({ daoMultiSigAddr: multiSigAddr });
        if (daoDetails.daoId === undefined) {
            return res.status(404).json({ message: 'DAO not found' });
        }
        //daoID won't change when dao details are being updated  also not the way to add a multisig, a different method to add multisig will be implemented. 
        daoDetails.daoName = _daoName;
        daoDetails.daoLocation = _daoLocation;
        daoDetails.targetAudience = _targetAudience;
        daoDetails.daoTitle = _daoTitle;
        daoDetails.daoDescription = _daoDescription;
        daoDetails.daoOverview = _daoOverview;
        daoDetails.daoImageIpfsHash = _daoImageIpfsHash;
        await daoRepository.save(daoDetails);
        res.status(200).json({ message: 'DAO details updated' });
    } catch (err){
        res.status(500).json({ error: 'Error updating DAO' })
    }
}


/**
 * Processes a fund request for a specific DAO (Decentralized Autonomous Organization).
 *
 * @param req - The Express request object containing the DAO multi-signature address and fund details in the request parameters and body.
 * @param res - The Express response object to send back the HTTP response.
 *
 * @remarks
 * The function extracts the multi-signature address and fund details from the request parameters and body.
 * It validates the required fields, fetches the DAO details from the database, and processes the fund request.
 * It handles errors and returns appropriate HTTP responses.
 *
 * @returns
 * - HTTP 200: If the fund request is successfully processed.
 * - HTTP 400: If any required fields are missing in the request parameters or body.
 * - HTTP 404: If the DAO with the given multi-signature address is not found.
 * - HTTP 500: If an error occurs while processing the fund request.
 */
export async function FundDao (req: Request, res: Response){
    const { _daoMultiSig } = req.params;//Dao to fund 
    if (!_daoMultiSig) {
        return res.status(400).json({ error: 'Missing required url params' })  //return 400 status if required fields are missing  //TODO: this should be a validation middleware function  to prevent potential errors
    }
    const {funderAddr, fundAmount} = req.body; //funder and the amount they want to fund  
    try {
        //TODO: mechanisms to transfer funds goes here
        //check if fundAmount is a positive number
       // if (fundAmount <= 0) {
       //     return res.status(400).json({ error: 'Invalid fund amount' });
      //}
        //check if funderAddr is valid
        //check if fundAmount is sufficient
        //update the fundAmount in the DAO model
        //add the funderAddr to the daoMultisigs array
        //save the updated DAO model to the database
        //send a notification to all the members in the DAO about the new fund request 
        //use a blockchain function & Transaction for ease even to check balance

        const daoRepository = AppDataSource.getRepository(Dao);
        const daoDetails = await daoRepository.findOneBy({
            daoMultiSigAddr: _daoMultiSig
        })
        if (typeof daoDetails === undefined || daoDetails.daoId === undefined) {
            return res.status(404).json({ message: 'DAO not found' });
        }
        //after crosschecked with the blockchain transaction/function 
        res.status(200).json({ message: 'Funding successfully' }); 
    } catch (error) { 
        res.status(500).json({ error: 'Error funding DAO' })
    }
}
