var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { daoContract, publicClient } from "./config.ts";
import { wagmiAbi } from "../utils/contractAbi/abi.ts";
import { Dao } from "../models/Dao.ts";
import { AppDataSource } from "../app.ts";
const daoRepository = AppDataSource.getRepository(Dao);
export const createNewDao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ destructuring values from the incoming form data
    //@refactoring to send diff stuff to blockchain, diff to db, the ipfs hash might be outsourced instead from params
    const { _daoName, _daoLocation, _targetAudience, _daoTitle, _daoDescription, _daoOverview, _daoImageIpfsHash, _multiSigAddr } = req.body;
    /*
      *Only the ones necessary for  blockchain
      */
    if (!_daoName || !_targetAudience || !_daoDescription || !_multiSigAddr) {
        return res.status(400).json({ error: 'Missing required' });
    }
    //contract taking in whatever it needs
    try {
        yield daoContract.write._createDAO([
            _daoName,
            _targetAudience,
            _daoDescription,
            _multiSigAddr
        ]);
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
        yield daoRepository.save(dao); //saving to db
        res.status(201).json({ message: 'DAO created successfully' });
        //consume an event here for the return message
        const logs = yield publicClient.getContractEvents({
            address: "0x8EC4eE1A1aEccE5Df1a630ea50Aa9716549cE9Ff",
            abi: wagmiAbi,
            eventName: 'DAOCreated'
        });
        console.log(logs);
        res.status(201).json(logs);
    }
    catch (error) {
        res.status(500).json({ error: 'Error Creating DAO' });
    }
});
export const getDaoDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { multiSigAddr } = req.body;
    //getting dao details saved from the blockchain
    try {
        const daoDetails = yield daoRepository.findOneBy({ multiSigAddr });
        if (daoDetails) {
            res.json(daoDetails);
        }
        else {
            res.status(404).json({ message: 'DAO not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error finding Dao' });
    }
});
