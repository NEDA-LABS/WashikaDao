//import { daoContract, publicClient } from "./config.ts";
import { Request, Response } from "express";
import { wagmiAbi } from "../utils/contractAbi/abi.ts";
import { Dao } from "../models/Dao.ts";
import { AppDataSource } from "../app.ts"; 
import { Proposal } from "../models/Proposal.ts";
import { Vote } from "../models/Vote.ts";

const proposalRepository = AppDataSource.getRepository(Proposal); 
const voteRepository = AppDataSource.getRepository(Vote); 

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

const UpvoteProposalById = async (req: Request, res: Response) => {
    //destructuring values from incoming form data 
    const { _proposalId, _voterAddr } = req.body;

    const _vote = new Vote();//Creating a new Vote object 
    
    if (!_proposalId ||!_voterAddr) {
        return res.status(400).json({ error: 'Missing required' })
    }
    try {
        //find proposal by proposalId 
        const _proposal = await proposalRepository.findOneBy({ proposalId: _proposalId });
        if (!_proposal) {
            return res.status(404).json({ message: 'Proposal not found' })
        }
        //Check if voter has already voted for this proposal
        for (let iter in _proposal.votes) {
            if (iter === _voterAddr) {
                return res.status(400).json({ error: 'Voter has already voted for this proposal' })
            } 
            //if voter has not voted, add vote to the proposal 
else {
                //Dealing with the vote object and the using the voteId to update our vote on the proposal 
                _vote.voteId = _vote.voteId; 
                _vote.proposalId = _proposal.proposalId; //setting the proposalId to the current proposal we want to vote on  
                _vote.voterAddr = _vote.voterAddr; //This will be put as the object from the bc  
                _vote.voteValue = true; //this is the upvote value  
                //this is declarative of our vote, now updating our current proposal instance to an upvote value & count 
                //updating the proposal details in the database 
                //_proposal.proposalStatus = 'VOTED';//user has voted -- will be set by another function  
                _proposal.numUpvotes += 1;//increasing no of upvotes to the number of votes 
 //TODO: Add the Blockchain Part 
                await voteRepository.save(_vote); //saving the vote to the database
                await proposalRepository.save(_proposal);
                res.status(200).json({ message: 'Vote successfully recorded & proposal updated with our new vote, an upvote' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Error processing vote' })
    }
}
//write for downvote then refactor the different sections to make it easier to debug 
export const DownVoteProposalById = async (req: Request, res: Response) => {
    //destructuring values from incoming form data 
    const { _proposalId, _voterAddr } = req.body;

    const _vote = new Vote();//Creating a new Vote object 
    
    if (!_proposalId ||!_voterAddr) {
        return res.status(400).json({ error: 'Missing required' })
    }
    try {
        //find proposal by proposalId 
        const _proposal = await proposalRepository.findOneBy({ proposalId: _proposalId });
        if (!_proposal) {
            return res.status(404).json({ message: 'Proposal not found' })
        }
        //Check if voter has already voted for this proposal
        for (let iter in _proposal.votes) {
            if (iter === _voterAddr) {
                return res.status(400).json({ error: 'Voter has already voted for this proposal' })
            } 
            //if voter has not voted, add vote to the proposal 
else {
                //Dealing with the vote object and the using the voteId to update our vote on the proposal 
                _vote.voteId = _vote.voteId; 
                _vote.proposalId = _proposal.proposalId; //setting the proposalId to the current proposal we want to vote on  
                _vote.voterAddr = _vote.voterAddr; //This will be put as the object from the bc  
                _vote.voteValue = false; //this is the downvote value  
                //this is declarative of our vote, now updating our current proposal instance to an upvote value & count 
                //updating the proposal details in the database 
                //_proposal.proposalStatus = 'VOTED';//user has voted -- will be set by another function  
                _proposal.numUpvotes += 1;//increasing no of upvotes to the number of votes 
 //TODO: Add the Blockchain Part 
                await voteRepository.save(_vote); //saving the vote to the database
                await proposalRepository.save(_proposal);
                res.status(200).json({ message: 'Vote successfully recorded & proposal updated with our new vote, a downvote' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Error processing vote' })
    }
}
//vote management