import { wagmiAbi } from "../utils/contractAbi/abi";
 import { daoContract, publicClient } from "./config";
import { Request, Response } from "express";

export const addMember = async (req: Request, res: Response) => {
//destructuring necessary data from requeest body

const { _email, _memberAddr, _callerAddr, _daoToJoinMultisig, _role}  = req.body;
  if (!_email || !_memberAddr || !_callerAddr || !_daoToJoinMultisig || !_role) {
  return res.status(400).json({error: 'Missing required'})
  }

  try {
  await daoContract.write.addMember([
     _email,
    _memberAddr,
    _callerAddr,
    _daoToJoinMultisig,
    _role
    ])
    //consume an event for the return message
    const evLogs = await publicClient.getContractEvents({
       address: "0x8EC4eE1A1aEccE5Df1a630ea50Aa9716549cE9Ff",
      abi: wagmiAbi,
      eventName: 'MemberAdded'
    })
    console.log(evLogs);
    res.status(201).json(evLogs);
  } catch (error) {
  res.status(500).json({error: 'Error adding member' });
  }
}
