import { eventNames } from "process";
//import { daoContract, publicClient } from "./config.ts";
import { Request, Response } from "express";
const Dao = require("../entity/Dao");
const Proposal = require("../entity/Proposal"); 
const Vote = require("../entity/Vote");
const MemberDetails = require("../entity/MemberDetails");
import { AppDataSource } from "../data-source";  

const memberDetailsRepository = AppDataSource.getRepository(MemberDetails); 

//TODO: add registry for whitelist 


export const whiteListMember = async (req: Request, res: Response) => {
    //@destructuring values from incoming form data
    const { _addrToAdd, _daoMultiSig, _caller } = req.body;
    if (!_addrToAdd || !_daoMultiSig || !_caller) {
        return res.status(400).json({ error: 'missing required' })
    }
    /**Blockchain will be done later 
    try {
        await daoContract.write.whiteListMember([
            _addrToAdd,
            _daoMultiSig,
            _caller
        ])
        //consuming events for the return message
        const evLogs = await publicClient.getContractEvents({
            address: "0x8EC4eE1A1aEccE5Df1a630ea50Aa9716549cE9Ff",
            abi: wagmiAbi,
            eventName: 'WhiteListed'
        })
        console.log(evLogs);
        res.status(201).json(evLogs);
    } catch (error) {
        res.status(500).json({ error: 'Error whitelisting member' })
    }
        */ 
}