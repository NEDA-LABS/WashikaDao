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

export async function RequestToJoinDao (req: Request, res: Response){
    const { _daoMultiSigAddr } = req.params; 
    //@ destructuring values from incoming form data
  //  const {_firstName, _lastName, _email, _password, _requesterAddr, _role,  } = req.body;
    //I am not sure this is the best way to get the password but the frontend should hash it, the above is more on the account creation page & details. 
    const { _fullName, _phoneNo, _role, _nationalIdNo, _requesterAddr}  = req.body; //for the db 
    if (!_daoMultiSigAddr) {
        try {
            //check if the regNo is mapped to a multisig if true map set it to multisig else throw an error, no such dao to join 
        } catch (error) {
            return res.status(500).json({ error: error.message });  //internal server error
        }
    }
    if (!_daoMultiSigAddr || !_requesterAddr || !_role) {
        return res.status(400).json({ error: 'Missing required' })
    }
    //adding them to the DAO members registry  
    try {
        const findDaoByMultiSig = await memberDetailsRepository.findOneBy(_daoMultiSigAddr); 
        //return error if dao not found 
        if (!findDaoByMultiSig) {
            return res.status(404).json({ error: 'DAO not found' });
        } 
        //send request for your address to be added to the whitelist 

        res.status(201).json({ message: 'Request sent to join dao sucessfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending request to join dao' });
    }
}
//TODO: add registry for whitelist 

export async function WhiteListUser(req: Request, res: Response) {
    const { _daoMultiSig } = req.params; 
    const memberDetails: typeof MemberDetails = req.body; 
    if (!(memberDetails.contains(memberDetails._fullName))) {
        return res.status(400).json({ error: 'missing required' })
    } 
       try { 
        const daoToBeAddedTo = await daoRepository.findOneBy(_daoMultiSig); 
        if (!daoToBeAddedTo || daoToBeAddedTo === undefined || daoToBeAddedTo === null) {
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
export async function BlackListMember(req: Request, res: Response) {
    const { multiSigAddr, addressToDelete } = req.params;//dao to delete user from
    if (!multiSigAddr ||!addressToDelete) {
        return res.status(400).json({ error: 'Missing required' })
    } 
    try {
        //retrive the dao first 
        const daoDetails = await daoRepository.findOneBy(multiSigAddr); 
        if (!daoDetails ||!daoDetails.multiSigAddr === undefined) {
            return res.status(404).json({ error: 'DAO not found' });
        } 
        
        //finding the member by the address 
        const memberToDelete = await memberDetailsRepository.findOne({ where : { addressToDelete }}) 
        if (!memberToDelete || daoDetails.members.some(m => m.memberId === memberToDelete.memberId)) { 
            return res.status(404).json({ message: `Member with address ${addressToDelete}` });
        } 
        //Removing the member from the DAO's list of members 
        daoDetails.members = daoDetails.members.filter(m => m.memberId !== memberToDelete.memberId); 
        //update the dao 
        await daoRepository.save(daoDetails); 
        return res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error Occured When  Deleting Member' });
    }
}

export async function GetAllMembers(req: Request, res: Response) {
    const {multiSigAddr } = req.params; 
    if (!multiSigAddr) {
        return res.status(400).json({ error: 'Missing required' })
    } 
    try {
const daoDetails = await daoRepository.findOne({ where: { multiSigAddr }, relations: ["members"] });
        if (!daoDetails ||!daoDetails.multiSigAddr === undefined) {
            return res.status(400).json({ error: 'Error locating DAO'});
    } 
    return res.status(200).json({ members: daoDetails.members }); 
}catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error Occured When Fetching Members' });
    }
}
