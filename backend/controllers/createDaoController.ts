//import { daoContract, publicClient } from "./config.ts";
import { Request, Response } from "express";
import { wagmiAbi } from "../utils/contractAbi/abi.ts";
import { Dao } from "../models/Dao.ts";
import { AppDataSource } from "../app.ts";


const daoRepository = AppDataSource.getRepository(Dao);

export const createNewDao = async (req: Request, res: Response) => {
    //@ destructuring values from the incoming form data
    //@refactoring to send diff stuff to blockchain, diff to db, the ipfs hash might be outsourced instead from params
    const { _daoName, _daoLocation, _targetAudience, _daoTitle, _daoDescription, _daoOverview, _daoImageIpfsHash, _multiSigAddr } = req.body;

    /*
      *Only the ones necessary for  blockchain
      */
    if (!_daoName || !_targetAudience || !_daoDescription || !_multiSigAddr) {
        return res.status(400).json({ error: 'Missing required' })
    }

    //contract taking in whatever it needs
    try {
      //  await daoContract.write._createDAO([
      //      _daoName,
      //      _targetAudience,
      //      _daoDescription,
      //      _multiSigAddr
      //  ])
        //saving the DAO details to the database
        const dao = new Dao();
        dao.daoName = _daoName;
        dao.daoLocation = _daoLocation;
        dao.targetAudience = _targetAudience;
        dao.daoTitle = _daoTitle;
        dao.daoDescription = _daoDescription;
        dao.daoOverview = _daoOverview;
        dao.daoImageIpfsHash = _daoImageIpfsHash;
        dao.multiSigAddr = _multiSigAddr;

        await daoRepository.save(dao); //saving to db
        res.status(201).json({ message: 'DAO created successfully' });

        //consume an event here for the return message
       // const logs = await publicClient.getContractEvents({
         //   address: "0x8EC4eE1A1aEccE5Df1a630ea50Aa9716549cE9Ff",
          //  abi: wagmiAbi,
          //  eventName: 'DAOCreated'
        //})
        //console.log(logs);
        //res.status(201).json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Error Creating DAO' })
    }
}

export const getDaoDetails = async (req: Request, res: Response) => {
    const funderAddr = req.params.funderAddr;
    const  multiSigAddr  = req.params.multiSigAddr;
    //getting dao details saved from the blockchain
    try {

        const daoDetails = await daoRepository.findOneBy({ multiSigAddr });

        if (daoDetails) {
            res.json(daoDetails);
        } else {
            res.status(404).json({ message: 'DAO not found' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error finding Dao' })
    }
}

export const updateDaoDetails = async (req: Request, res: Response) => {
    const { multiSigAddr, _daoName, _daoLocation, _targetAudience, _daoTitle, _daoDescription, _daoOverview, _daoImageIpfsHash } = req.body;

    try {
        const daoDetails = await daoRepository.findOneBy({ multiSigAddr });
        if (!daoDetails) {
            return res.status(404).json({ message: 'DAO not found' });
        }
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

export const FundDao = async (req: Request, res: Response) => {
    const {funderAddr, multiSigAddr} = req.body; 

    try {
        //TODO:mechanisms to transfer funds goes here
        const daoMultisig = await daoRepository.findOneBy({
            multiSigAddr
        })
        if (!daoMultisig) {
            return res.status(404).json({ message: 'DAO not found' });
        }
        res.status(200).json({ message: 'Funding successfully' }); 
    } catch (error) { 
        res.status(500).json({ error: 'Error funding DAO' })
    }
    
}
