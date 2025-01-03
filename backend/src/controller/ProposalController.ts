//import { daoContract, publicClient } from "./config.ts";
import { Request, Response } from "express";
import { Dao } from "../entity/Dao";
import { Proposal } from "../entity/Proposal";
import { Vote } from "../entity/Vote";
import { AppDataSource } from "../data-source";
import { ObjectLiteral } from "typeorm";
import { IProposal } from "../Interfaces/EntityTypes";
import { log } from "console";

const proposalRepository = AppDataSource.getRepository(Proposal);
const voteRepository = AppDataSource.getRepository(Vote);
const daoRepository = AppDataSource.getRepository(Dao);

//Create proposal,read proposal, read all proposals, update proposal if not already voted,  delete proposal if not yet voted on.
/**Handling a post request sent to {'/proposal'} to create a new proposal*/
/**
 * Handles a POST request sent to '/proposal' to create a new proposal.
 *
 * @param req - The Express request object containing the proposal data and multiSigAddr in the parameters.
 * @param res - The Express response object to send back the HTTP response.
 *
 * @remarks
 * This function first checks if the required parameters are present.
 * It then validates the proposal data and checks if a proposal with the same ID already exists.
 * If all checks pass, it creates a new proposal and saves it to the database.
 * Finally, it sends a success response or an error response based on the outcome.
 *
 * @returns - An HTTP response with a status code and a JSON object containing a message.
 */
export async function CreateProposal(req: Request, res: Response) {
  const { multiSigAddr } = req.params;
  console.log(multiSigAddr);

  if (!multiSigAddr) {
    return res.status(400).json({ error: "Missing required from url params" });
  }
  const proposalData = req.body;
  //check missing details
  if (!proposalData) {
    return res.status(400).json({ error: "Missing required in request body" });
  }
  try {
    // //check if proposal exists
    // const proposalId: number = proposalData.proposalId; //find proposal by proposalId
    // const proposalFound = await proposalRepository.findOneBy({ proposalId });
    // if (proposalFound) {
    //   return res.status(400).json({ error: "Proposal already exists" });
    //   //you can capture more sanitization errors here with the if else but lets go to what we want to do here instead.
    // } else {
      //if proposal doesn't exist create or build a new proposal using the data from the form submission
      const createdProposal = proposalRepository.create(proposalData);
      await proposalRepository.save(createdProposal);
      res.status(201).json({ 
        message: "Proposal created successfully", 
        // proposalId: createdProposal.proposalId,  // Ensure proposalId is included
        createdProposal 
      });
      //TODO: BLOCKCHAIN INTEGRATION
    // }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
}

/**
 * Retrieves the details of a proposal by its ID.
 *
 * @param req - The Express request object containing the proposal ID in the parameters.
 * @param res - The Express response object to send back the HTTP response.
 *
 * @remarks
 * This function extracts the proposal ID from the request parameters and attempts to find the corresponding proposal in the database.
 * If the proposal is found, it sends a success response with the proposal details.
 * If the proposal is not found, it sends a 400 error response with a message indicating that the proposal was not found.
 * If an error occurs during the database query, it sends a 500 error response with a message indicating the error.
 *
 * @returns - An HTTP response with a status code and a JSON object containing the proposal details or an error message.
 */
export async function GetProposalDetailsById(req: Request, res: Response) {
  /**Grabbing the proposal ID from the url params */
    /** Parse proposalId as a number */
    const proposalId: number = parseInt(req.params.proposalId, 10);

    if (isNaN(proposalId)) {
      return res.status(400).json({ error: "Invalid proposal ID" });
    }

  try {
    //find proposal by proposalId if doesn't exist will be caught within
    const proposalDetails: Proposal | null = await proposalRepository.findOneBy(
      { proposalId }
    );

    if (
      typeof proposalDetails === undefined ||
      typeof proposalDetails === null
    ) {
      return res
        .status(400)
        .json({ message: "Proposal not found or does not exist" });
    }
    return res.status(200).json(proposalDetails);
  } catch (error) {
    //TODO: BLOCKCHAIN INTEGRATION
    res.status(500).json({ error: "Error fetching proposal" });
  }
}

// /**
//  * Handles a POST request to upvote a proposal by its ID.
//  *
//  * @param req - The Express request object containing the proposal ID and voter address in the parameters and request body.
//  * @param res - The Express response object to send back the HTTP response.
//  *
//  * @remarks
//  * This function extracts the proposal ID and voter address from the request parameters and body.
//  * It checks if the required parameters are present and if the voter is authorized.
//  * If all checks pass, it creates a new vote with a vote value of true, associates it with the proposal and voter, and saves it to the database.
//  * It then updates the proposal's upvote count and saves the updated proposal.
//  * Finally, it sends a success response or an error response based on the outcome.
//  *
//  * @returns - An HTTP response with a status code and a JSON object containing a message.
//  */
// export async function UpvoteProposalById (req: Request, res: Response) {
//     const {multiSigAddr} = req.params;
//     const { proposalId } = req.params;

//     if (!multiSigAddr ||!proposalId) {
//         return res.status(400).json({ error: 'Missing required from url params' })
//     }

//     const voterAddr = req.cookies.voterAddr || req.body.voterAddr;

//     if (!voterAddr) {
//         return res.status(401).json({ error: 'Unauthorized' })
//     }

//     const voteDetails: typeof Vote = req.body;
//     voteDetails.voteValue = true;
//     voteDetails.proposalId = proposalId;
//     voteDetails.voterAddr = voterAddr;

//     try {
//         // Find proposal by proposalId
//         const foundProposal: typeof Proposal = await proposalRepository.findOneBy({ proposalId: proposalId });

//         if (foundProposal.proposalId === undefined || foundProposal.proposalId === null) {
//             return res.status(404).json({ message: 'Proposal not found' })
//         }

//         // Check if voter has already voted for this proposal
//         const proposalsVoted = await proposalRepository.findOne({ where: {proposalId}, relations: ['votes']})

//         if (proposalsVoted.includes(proposalId)) {
//             return res.status(400).json({ error: 'Voter has already voted for this proposal' })
//         }

//         const createdVote: typeof Vote =  voteRepository.create(voteDetails);
//         await voteRepository.save(createdVote);

//         res.status(200).json({ message: 'Vote successfully recorded & proposal updated with our new vote, an upvote' });

//         // Updating the proposal
//         foundProposal.numUpvotes += 1;

//         // Updating the proposal
//         await proposalRepository.save(foundProposal);

//         res.status(200).json({ message: 'updated proposal successfully' });

//         // TODO: BLOCKCHAIN INTEGRATION
//     } catch (error) {
//         res.status(500).json({ error: 'Error processing or casting  upvote' })
//     }
// }

// //write for downvote then refactor the different sections to make it easier to debug
// /**
//  * Handles a POST request to downvote a proposal by its ID.
//  *
//  * @param req - The Express request object containing the proposal ID and voter address in the parameters and request body.
//  * @param res - The Express response object to send back the HTTP response.
//  *
//  * @remarks
//  * This function extracts the proposal ID and voter address from the request parameters and body.
//  * It checks if the required parameters are present and if the voter is authorized.
//  * If all checks pass, it creates a new vote with a vote value of false, associates it with the proposal and voter, and saves it to the database.
//  * It then updates the proposal's downvote count and saves the updated proposal.
//  * Finally, it sends a success response or an error response based on the outcome.
//  *
//  * @returns - An HTTP response with a status code and a JSON object containing a message.
//  */
// export const DownVoteProposalById = async (req: Request, res: Response) => {
//     const {multiSigAddr} = req.params;
//     const { proposalId } = req.params;
//     if (!multiSigAddr ||!proposalId) {
//         return res.status(400).json({ error: 'Missing required from url params' })
//     }
//     const voterAddr = req.cookies.voterAddr || req.body.voterAddr;
//     if (!voterAddr) {
//         return res.status(401).json({ error: 'Unauthorized' })
//     }
//     const voteDetails: typeof Vote = req.body;//can also be named as downvote type of Vote
//     voteDetails.voteValue = false;
//     voteDetails.proposalId = proposalId;
//     voteDetails.voterAddr = voterAddr;
//     try {
//         //find proposal by proposalId
//         const foundProposal: typeof Proposal = await proposalRepository.findOneBy({ proposalId: proposalId });
//         if (foundProposal.proposalId === undefined || foundProposal.proposalId === null) {
//             return res.status(404).json({ message: 'Proposal not found' })
//         }
//         //Check if voter has already voted for this proposal
//         const proposalsVoted = await proposalRepository.findOne({ where: {proposalId}, relations: ['votes']})
//          if (proposalsVoted.includes(proposalId)) {
//             return res.status(400).json({ error: 'Voter has already voted for this proposal' })
//         }
//         const createdVote: typeof Vote =  voteRepository.create(voteDetails);
//         await voteRepository.save(createdVote);
//         res.status(200).json({ message: 'Vote successfully recorded & proposal updated with our new vote, an upvote' });
//         //updating the proposal
//         foundProposal.numDownvotes += 1;
//         //updating the proposal
//         await proposalRepository.save(foundProposal);
//         res.status(200).json({ message: 'updated proposal successfully' });
//         //TODO: BLOCKCHAIN INTEGRATION
//     } catch (error) {
//         res.status(500).json({ error: 'Error processing or casting  upvote' })
//     }
// }

/**
 * Retrieves all proposals associated with a specific DAO.
 *
 * @param req - The Express request object containing the multiSigAddr in the parameters.
 * @param res - The Express response object to send back the HTTP response.
 *
 * @remarks
 * This function extracts the multiSigAddr from the request parameters and attempts to find the corresponding DAO in the database.
 * If the DAO is found, it retrieves all proposals associated with that DAO.
 * If the DAO is not found, it sends a 404 error response with a message indicating that the DAO was not found.
 * If an error occurs during the database query, it sends a 400 error response with a message indicating the error.
 *
 * @returns - An HTTP response with a status code and a JSON object containing the proposals associated with the DAO.
 * If the DAO is found and proposals exist, the response status code will be 200 and the JSON object will contain the proposals.
 * If the DAO is not found, the response status code will be 404 and the JSON object will contain an error message.
 * If an error occurs, the response status code will be 400 and the JSON object will contain an error message.
 */
export async function GetAllProposalsInDao(req: Request, res: Response) {
  const { multiSigAddr } = req.params;

  if (!multiSigAddr) {
    return res.status(400).json({ error: "Missing required multiSigAddr" });
  }

  try {
    // Check if DAO exists
    const daoSought = await daoRepository.findOne({
      where: { daoMultiSigAddr: multiSigAddr },
      relations: ["proposal"], // Ensure the proposals relation is loaded
    });

    if (!daoSought) {
      return res.status(404).json({ message: "DAO not found" });
    }

    // Retrieve all proposals associated with this DAO
    const proposals = daoSought.proposal;

    return res.status(200).json({ proposals });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error getting proposals" });
  }
}
