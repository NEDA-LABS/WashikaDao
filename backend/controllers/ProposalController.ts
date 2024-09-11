import { daoContract, publicClient } from "./config.ts";
import { Request, Response } from "express";
import { wagmiAbi } from "../utils/contractAbi/abi.ts";
import { Dao } from "../models/Dao.ts";
import { AppDataSource } from "../app.ts"; 
import { Proposal } from "../models/Proposal.ts";

const proposalRepository = AppDataSource.getRepository(Proposal); 
export const CreateProposal = async (req: Request, res: Response) => {
    //destructuring values from incoming form data 
    const proposalData = await req.body.data; 
    //refactoring to send diff stuff to blockchain, diff to db, the ipfs hash might be outsourced instead from params
    //check if proposal already exists, if not, create a new one 
    const proposalId = proposalData.proposalId;
    const proposalTitle = proposalData.proposalTitle; 
    const proposalDescription = proposalData.proposalDescription;
    const proposalStatus = proposalData.status;
    const daoMultiSigAddr = proposalData.daoMultiSigAddr; 
    try {
    //find proposal by proposalId 
    const _proposal = await proposalRepository.findOneBy(proposalId); 
    if (_proposal === proposalId) {
        return res.status(400).json({ error: 'Proposal already exists' })
    }
    //if proposal does not exist, create a new one 
    const proposal = new Proposal();
    proposal.proposalId = proposalId;
    proposal.proposalTitle = proposalTitle;
    proposal.proposalDescription = proposalDescription;
    proposal.proposalStatus = proposalStatus;
    proposal.daoMultiSigAddr = daoMultiSigAddr; 
    //save proposal to the database 
    await proposalRepository.save(proposal);
    res.status(201).json({ message: 'Proposal created successfully'});
    } 
    //TODO: BLOCKCHAIN INTEGRATION 
    catch(error) {
        res.status(500).json({ error: 'Error creating proposal' })
    }
}
export const GetProposalDetailsById = async (req: Request, res: Response) => {

const _proposalId = parseInt(req.params.proposalId);

    try {
    //find proposal by proposalId 
const proposalDetails = await proposalRepository.findOneBy({ proposalId: _proposalId });
    if (!proposalDetails) {
        return res.status(404).json({ message: 'Proposal not found' })
    }
    res.json(proposalDetails);
    } 
    //TODO: BLOCKCHAIN INTEGRATION 
    catch(error) {
        res.status(500).json({ error: 'Error fetching proposal' })
    }
}

export const UpvoteProposal = async (req: Request, res: Response) => {
    //destructuring values from incoming form data 
    const { _proposalId, _voterAddr } = req.body;

    if (!_proposalId ||!_voterAddr) {
        return res.status(400).json({ error: 'Missing required' })
    }
    try {
        //find proposal by proposalId 
        const _proposal = await proposalRepository.findOneBy({ proposalId: _proposalId });
        if (!_proposal) {
            return res.status(404).json({ message: 'Proposal not found' })
        }
        //check if the voter has already voted 
        //TODO: START FROM HERE TODAY 
    }
} catch (   e ) {
}
}
