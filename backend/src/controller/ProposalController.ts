//import { daoContract, publicClient } from "./config.ts";
import { Request, Response } from "express";
const Dao = require("../entity/Dao");
const Proposal = require("../entity/Proposal"); 
const Vote = require("../entity/Vote");
import { AppDataSource } from "../data-source";  
import { ObjectLiteral } from "typeorm";
import { IProposal } from "../Interfaces/EntityTypes";

const proposalRepository = AppDataSource.getRepository(Proposal); 
const voteRepository = AppDataSource.getRepository(Vote); 
const daoRepository = AppDataSource.getRepository(Dao);

/**Handling a post request sent to {'/proposal'} to create a new proposal*/
export async function CreateProposal(req: Request, res: Response){
    const { multiSigAddr } = req.params; 
    if (!multiSigAddr) {
        return res.status(400).json({ error: 'Missing required from url params' })
    }
    const proposalData:typeof Proposal = req.body;  
    //check missing details
    if (!proposalData) {
        return res.status(400).json({ error: 'Missing required in request body' })
    }
    try {
        //check if proposal exists 
        const proposalId: string = proposalData.proposalId; 
    //find proposal by proposalId 
    const proposalFound: typeof Proposal = await proposalRepository.findOneBy({ proposalId });
    if (proposalFound.proposalId === proposalId) {
        return res.status(400).json({ error: 'Proposal already exists' })
        //you can capture more sanitization errors here with the if else but lets go to what we want to do here instead.
        } else {
        //if proposal doesn't exist create or build a new proposal using the data from the form submission 
        const createdProposal: typeof Proposal = await proposalRepository.create(proposalData); 
            await proposalRepository.save(createdProposal); 
            res.status(201).json({ message: 'Proposal created successfully'});
            //TODO: BLOCKCHAIN INTEGRATION 
            }
        }
    catch(error) {
        res.status(500).json({ error: 'Error creating proposal' })
    }
}


export async function GetProposalDetailsById (req: Request, res: Response) {

    /**Grabbing the proposal ID from the url params */
    const _proposalId: string = req.params.proposalId; 

    try {
    //find proposal by proposalId if doesn't exist will be caught within
const proposalDetails: typeof Proposal = await proposalRepository.findOneBy({ proposalId: _proposalId });
    if (typeof proposalDetails === undefined || typeof proposalDetails === null) {
        return res.status(400).json({ message: 'Proposal not found or does not exist' })
    }
    return res.status(200).json(proposalDetails);
    } 
    //TODO: BLOCKCHAIN INTEGRATION 
    catch(error) {
        res.status(500).json({ error: 'Error fetching proposal' })
    }
}


export async function UpvoteProposalById (req: Request, res: Response) {
    const {multiSigAddr} = req.params.multiSigAddr;
    const { proposalId } = req.params.proposalId; 
    if (!multiSigAddr ||!proposalId) {
        return res.status(400).json({ error: 'Missing required from url params' })
    }
    const voterAddr = req.cookies.voterAddr || req.body.voterAddr;
    if (!voterAddr) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const voteDetails: typeof Vote = req.body;
    voteDetails.voteValue = true; 
    voteDetails.proposalId = proposalId; 
    voteDetails.voterAddr = voterAddr; 
     //contains upvote information 
        try {
        //find proposal by proposalId 
        const foundProposal: typeof Proposal = await proposalRepository.findOneBy({ proposalId: proposalId });
        if (foundProposal.proposalId === undefined || foundProposal.proposalId === null) {
            return res.status(404).json({ message: 'Proposal not found' })
        }
        //Check if voter has already voted for this proposal
        const proposalsVoted = await proposalRepository.findOne({ where: {proposalId}, relations: ['votes']}) 
         if (proposalsVoted.includes(proposalId)) {
            return res.status(400).json({ error: 'Voter has already voted for this proposal' })
        }
        const createdVote =  voteRepository.create(voteDetails);
        await voteRepository.save(createdVote); 
        res.status(200).json({ message: 'Vote successfully recorded & proposal updated with our new vote, an upvote' });
        //updating the proposal 
        foundProposal.numUpvotes += 1; 
        //updating the proposal 
        await proposalRepository.save(foundProposal); 
        res.status(200).json({ message: 'updated proposal successfully' }); 
        //TODO: BLOCKCHAIN INTEGRATION 
    } catch (error) {
        res.status(500).json({ error: 'Error processing or casting  upvote' })
    }
}


//write for downvote then refactor the different sections to make it easier to debug 
export const DownVoteProposalById = async (req: Request, res: Response) => {
    const {multiSigAddr} = req.params.multiSigAddr;
    const { proposalId } = req.params.proposalId; 
    if (!multiSigAddr ||!proposalId) {
        return res.status(400).json({ error: 'Missing required from url params' })
    }
    const voterAddr = req.cookies.voterAddr || req.body.voterAddr;
    if (!voterAddr) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const voteDetails: typeof Vote = req.body;
    voteDetails.voteValue = false; 
    voteDetails.proposalId = proposalId; 
    voteDetails.voterAddr = voterAddr; 
    try {
        //find proposal by proposalId 
        const foundProposal: typeof Proposal = await proposalRepository.findOneBy({ proposalId: proposalId });
        if (foundProposal.proposalId === undefined || foundProposal.proposalId === null) {
            return res.status(404).json({ message: 'Proposal not found' })
        }
        //Check if voter has already voted for this proposal
        const proposalsVoted = await proposalRepository.findOne({ where: {proposalId}, relations: ['votes']}) 
         if (proposalsVoted.includes(proposalId)) {
            return res.status(400).json({ error: 'Voter has already voted for this proposal' })
        }
        const createdVote =  voteRepository.create(voteDetails);
        await voteRepository.save(createdVote); 
        res.status(200).json({ message: 'Vote successfully recorded & proposal updated with our new vote, an upvote' });
        //updating the proposal
        foundProposal.numDownvotes += 1; 
        //updating the proposal 
        await proposalRepository.save(foundProposal); 
        res.status(200).json({ message: 'updated proposal successfully' }); 
        //TODO: BLOCKCHAIN INTEGRATION
    } catch (error) {
        res.status(500).json({ error: 'Error processing or casting  upvote' })
    }
    
}


export async function GetAllProposalsInDao(req: Request, res: Response) {
    const { multiSigAddr } = req.params; 
    if (!multiSigAddr) {
        return res.status(400).json({ error: 'Missing required multiSigAddr' })
    }
    try {
        //does dao exist? 
        const daoSought = await daoRepository.findOneBy({ multiSigAddr: multiSigAddr });
        if (!daoSought || !daoSought.multiSigAddr === undefined) {
            return res.status(404).json({ message: 'DAO not found' })
        }
        //find all proposals in this DAO 
        const proposals = await proposalRepository.findOne({where:{multiSigAddr},  relations: ["proposals"]});
        return res.status(200).json({proposals: daoSought.proposals})
    } catch (error) {
        console.error(error); 
        return res.status(400).json({message: "Error Getting proposals" }); 
    }
}