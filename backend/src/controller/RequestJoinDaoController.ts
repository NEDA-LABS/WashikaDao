import { eventNames } from "process";
//import { daoContract, publicClient } from "./config.ts";
import { Request, Response } from "express";
const Dao = require("../entity/Dao");
const Proposal = require("../entity/Proposal"); 
const Vote = require("../entity/Vote");
const MemberDetails = require("../entity/MemberDetails");
import { AppDataSource } from "../data-source";  


const memberDetailsRepository = AppDataSource.getRepository(MemberDetails)
export const requestToJoinDao = async (req: Request, res: Response) => {

    //@ destructuring values from incoming form data
    const { _multiSigAddr, _requester, _role } = req.body;
    const { _phoneNo, _nationalIdNo} = req.body; //for the db 

    if (!_multiSigAddr || !_requester || !_role) {
        return res.status(400).json({ error: 'Missing required' })
    }
    /* ******************************** Blockchain will be updated 
    try {
        await daoContract.write.requestToJoinDao([
            _multiSigAddr,
            _requester,
            _role
        ])
        //consume event logs for the return message
        const evLogs = await publicClient.getContractEvents({
            address: "0x8EC4eE1A1aEccE5Df1a630ea50Aa9716549cE9Ff",
            abi: wagmiAbi,
            eventName: 'requestedJoinDao'
        })
        console.log(evLogs);
        res.status(201).json(evLogs);
    } catch (error) {
        res.status(500).json({ error: 'Error sending request' })
    }
        */ 
    //adding them to the DAO members registry  
    try {
        const findDaoByMultiSig = await memberDetailsRepository.findOneBy(_multiSigAddr); 
        //return error if dao not found 
        if (!findDaoByMultiSig) {
            return res.status(404).json({ error: 'DAO not found' });
        }
       const memberDetails = new MemberDetails(); 
        memberDetails.daoMultiSig = _multiSigAddr; 
        memberDetails.memberAddr = _requester; 
        memberDetails.memberRole = _role;  
        //setting the others as well because why not 
        memberDetails.nationalIdNo = _nationalIdNo; 
        memberDetails.phoneNumber = _phoneNo;
        
        await memberDetailsRepository.save(memberDetails); 
        res.status(201).json({ message: 'Request sent to join dao sucessfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending request to join dao' });
    }
}
