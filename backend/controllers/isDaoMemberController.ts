import { eventNames } from "process";
import { daoContract, publicClient } from "./config";
import { Request, Response } from "express";
import { wagmiAbi } from "../utils/contractAbi/abi";

export const isDaoMember = async (req: Request, res: Response) => {
    //@ destructuring values from incoming form data
    const { _memberToCheck, _daoMultisig } = req.body;

    if (!_memberToCheck || !_daoMultisig) {
        return res.status(400).json({ error: 'missing required fields' })
    }
    try {
        const isMember = await daoContract.write.isDaoMember([
            _memberToCheck,
            _daoMultisig
        ])
        //@ts-ignore
        if (isMember === 'true' || isMember === 'false') {
            res.status(200).json(isMember)
            console.log(isMember);
        }

    } catch (error) {
        res.status(500).json({ error: 'request erroed' })
    }
}

