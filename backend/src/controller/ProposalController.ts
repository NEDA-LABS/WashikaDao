import { Request, Response } from "express";
import { Dao } from "../entity/Dao";
import { Proposal } from "../entity/Proposal";
import { Vote } from "../entity/Vote";
import { IVote } from "../Interfaces/EntityTypes";
import AppDataSource from "../data-source";
const proposalRepository = AppDataSource.getRepository(Proposal);
const voteRepository = AppDataSource.getRepository(Vote);


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

export async function GetAllProposalsInDao(req: Request, res: Response) {
  const { daoMultiSigAddr } = req.body;

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
