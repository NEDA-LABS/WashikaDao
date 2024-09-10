import { eventNames } from "process";
import { daoContract, publicClient } from "./config.ts";
import { Request, Response } from "express";
import { wagmiAbi } from "../utils/contractAbi/abi.ts";


export const requestToJoinDao = async (req: Request, res: Response) => {

    //@ destructuring values from incoming form data
    const { _multiSigAddr, _requester, _role } = req.body;
    if (!_multiSigAddr || !_requester || !_role) {
        return res.status(400).json({ error: 'Missing required' })
    }
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
}
