import { Request, Response } from "express";
import { Dao } from "../entity/Dao";
import { Proposal } from "../entity/Proposal";
import { Vote } from "../entity/Vote";
import { IVote } from "../Interfaces/EntityTypes";
import AppDataSource from "../data-source";
const proposalRepository = AppDataSource.getRepository(Proposal);
const voteRepository = AppDataSource.getRepository(Vote);

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
  const {
    proposalCustomIdentifier,
    proposalOwner,
    proposalTitle,
    proposalSummary,
    proposalDescription,
    proposalStatus,
    amountRequested,
    profitSharePercent,
    numUpVotes,
    numDownVotes,
    daoMultiSigAddr,
  } = req.body;
  const proposalData = {
    proposalCustomIdentifier,
    daoMultiSigAddr,
    proposalOwner,
    proposalTitle,
    proposalSummary,
    proposalDescription,
    proposalStatus,
    amountRequested,
    profitSharePercent,
    numUpVotes,
    numDownVotes,
  };
  //check missing details
  if (!proposalData) {
    return res
      .status(400)
      .json({ error: "Missing required field in request body" });
  }
  try {
    //if proposal doesn't exist create or build a new proposal using the data from the form submission
    const foundProposal = await proposalRepository.findOneBy({
      proposalCustomIdentifier,
    });
    if (foundProposal) {
      return res
        .status(400)
        .json({ error: "Bad Request, proposal already exists" });
    }
    const createdProposal = proposalRepository.create(proposalData);
    await proposalRepository.save(createdProposal);
    res.status(201).json({
      message: "Proposal created successfully",
      createdProposal,
    });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
}

/**
 * Retrieves the details of a proposal using its `proposalCustomIdentifier`.
 *
 * @param req - The Express request object containing the proposal identifier in the query parameters.
 * @param res - The Express response object to send back the HTTP response.
 *
 * @remarks
 * This function follows these steps:
 * 1. Extracts `proposalCustomIdentifier` from the request query.
 * 2. Validates that `proposalCustomIdentifier` is present and is a string.
 *    - Returns a 404 response if it's missing or invalid.
 * 3. Queries the database to find the proposal, joining with votes:
 *    - Maps the number of upvotes (`voteValue = true`).
 *    - Maps the number of downvotes (`voteValue = false`).
 * 4. If no proposal is found, returns a 404 response.
 * 5. Sends a success response with the proposal details if found.
 * 6. Catches and logs any errors, returning a 500 response if an error occurs.
 *
 * @returns - An HTTP response with a status code and a JSON object containing:
 *            - The proposal details if successful.
 *            - An error message if the proposal is not found or if an error occurs.
 */

export async function GetProposalDetails(req: Request, res: Response) {
  /**Grabbing the proposal ID from the url params */
  /** Parse proposalId as a number */
  const { proposalCustomIdentifier } = req.query;

  if (
    !proposalCustomIdentifier ||
    typeof proposalCustomIdentifier !== "string"
  ) {
    return res.status(404).json({
      message: "Error missing required proposalCustomIdentifier",
    });
  }

  try {
    //find proposal by proposalId if doesn't exist will be caught within
    const proposalDetails = await proposalRepository
      .createQueryBuilder("proposal")
      .leftJoinAndSelect("proposal.votes", "vote")
      .where("proposal.proposalCustomIdentifier = :proposalCustomIdentifier", {
        proposalCustomIdentifier,
      })
      .loadRelationCountAndMap(
        "proposal.numUpVotes",
        "proposal.votes",
        "upvotes",
        (qb) => qb.where("upvotes.voteValue = true")
      )
      .loadRelationCountAndMap(
        "proposal.numDownVotes",
        "proposal.votes",
        "downvotes",
        (qb) => qb.where("downvotes.voteValue = false")
      )
      .getOne();

    if (!proposalDetails) {
      return res
        .status(404)
        .json({ message: "Proposal not found or does not exist" });
    }
    return res.status(200).json(proposalDetails);
  } catch (error) {
    res.status(500).json({ error: "Error fetching proposal" });
  }
}

/**
 * Handles a POST request to vote (upvote or downvote) on a proposal by its ID.
 *
 * @param req - The Express request object containing the proposal identifier, voter address, and vote value in the request body.
 * @param res - The Express response object to send back the HTTP response.
 *
 * @remarks
 * This function performs the following steps:
 * 1. Extracts the `proposalCustomIdentifier`, `voterAddr`, and `voteValue` from the request body.
 * 2. Validates that all required fields are present.
 * 3. Retrieves the proposal from the database using its identifier.
 *    - Returns a 404 response if the proposal does not exist.
 * 4. Checks if the voter has already voted on this proposal.
 *    - Returns a 400 response if a vote already exists.
 * 5. Creates a new vote with the provided `voteValue` (true for upvote, false for downvote).
 * 6. Saves the vote to the database.
 * 7. Sends a success response if the vote is successfully recorded.
 * 8. Catches and logs any errors, returning a 500 response if an error occurs.
 *
 * @returns - An HTTP response with a status code and a JSON object containing a message.
 */

export async function VoteProposal(req: Request, res: Response) {
  const { proposalCustomIdentifier, voterAddr, voteValue } = req.body;

  if (!proposalCustomIdentifier || !voterAddr || voteValue === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const foundProposal = await proposalRepository.findOneBy({
      proposalCustomIdentifier,
    });

    if (!foundProposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    const existingVote = await voteRepository.findOne({
      where: { proposal: foundProposal, voterAddr },
    });

    if (existingVote) {
      return res.status(400).json({ error: "Voter has already voted" });
    }

    const newVote = voteRepository.create({
      proposal: foundProposal,
      voterAddr,
      voteValue,
    });

    await voteRepository.save(newVote);

    return res.status(201).json({ message: "Vote successfully recorded" });
  } catch (error) {
    console.error("Error casting vote:", error);
    res.status(500).json({ error: "Error processing vote" });
  }
}

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
  const { daoMultiSigAddr } = req.query;

  if (!daoMultiSigAddr || typeof daoMultiSigAddr !== "string") {
    return res.status(400).json({ error: "Missing required multiSigAddr" });
  }

  try {
    // Retrieve proposals directly associated with the provided multiSigAddr
    const proposalsFound = await proposalRepository.find({
      where: { daoMultiSigAddr },
    });

    if (!proposalsFound) {
      return res
        .status(404)
        .json({ message: " Error No proposals found for this DAO" });
    }
    return res.status(200).json({ proposalsFound });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error getting proposals" });
  }
}
