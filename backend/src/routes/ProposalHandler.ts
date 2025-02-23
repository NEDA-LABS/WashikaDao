import express from "express";
const router = express.Router()

import { GetProposalDetails, GetAllProposalsInDao, CreateProposal, VoteProposal } from "../controller/ProposalController";

import { Request, Response } from "express";
import { Authenticator } from "../utils/Authenticator/Authenticator";

//TODO: Include better documentation for this feature


router.get('/GetAllProposalsInDao', Authenticator, async (req: Request, res: Response) => {await GetAllProposalsInDao(req, res)});
router.get('/GetProposalDetails', Authenticator, async (req: Request, res: Response) => { await GetProposalDetails(req, res)});
router.post('/CreateProposal', Authenticator,  async (req: Request, res: Response) => {await CreateProposal(req, res)});
//voting a proposal
router.post('/voteProposal', Authenticator, async (req: Request, res: Response) =>{ await  VoteProposal(req, res)});
//Get all proposals from a DAO
export default router;
