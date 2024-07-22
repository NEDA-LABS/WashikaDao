import { eventNames } from "process";
import { daoContract, publicClient } from "./config";
import { Request, Response } from "express";
import { wagmiAbi } from "../utils/contractAbi/abi";


export const createNewDao = async (req: Request, res: Response) => {
  //@ destructuring values from the incoming form data
  const { _daoName, _targetAudience, _daoDescription, _multisigAddr } = req.body;

  if (!_daoName || !_targetAudience || !_daoDescription || !_multisigAddr) {
    return res.status(400).json({ error: 'Missing required' })
  }

  try {
    await daoContract.write._createDAO([
      _daoName,
      _targetAudience,
      _daoDescription,
      _multisigAddr
    ])
    //consume an event here for the return message
    const logs = await publicClient.getContractEvents ({
      address: "0x8EC4eE1A1aEccE5Df1a630ea50Aa9716549cE9Ff",
      abi: wagmiAbi,
      eventName: 'DAOCreated'
    })
    console.log(logs);
    res.status(201).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Error Creating DAO' })
  }
}
