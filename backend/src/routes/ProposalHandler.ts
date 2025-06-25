import express from "express";
const router = express.Router()

import { GetProposalDetails, GetAllProposalsInDao, CreateProposal, VoteProposal } from "../controllers/ProposalController";

import { Request, Response } from "express";

//TODO: Include better documentation for this feature


router.get('/GetAllProposalsInDao', async (req: Request, res: Response) => {await GetAllProposalsInDao(req, res)});
router.get('/GetProposalDetails', async (req: Request, res: Response) => { await GetProposalDetails(req, res)});
router.post('/CreateProposal', async (req: Request, res: Response) => {await CreateProposal(req, res)});
//voting a proposal
router.post('/voteProposal', async (req: Request, res: Response) =>{ await  VoteProposal(req, res)});
//Get all proposals from a DAO
export default router;
