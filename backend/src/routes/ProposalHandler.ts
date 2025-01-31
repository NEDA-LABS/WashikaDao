import express from "express";
const router = express.Router()

import { GetProposalDetailsById, GetAllProposalsInDao, CreateProposal, UpvoteProposalById, DownVoteProposalById } from "../controller/ProposalController";

import { Request, Response } from "express";
import { RouteOAuthManager } from "../utils/Authenticator/Authenticator";
//TODO: Include better documentation for this feature


router.get('/GetAllProposalsInDao/:multiSigAddr', async(req: Request, res: Response) => {await GetAllProposalsInDao(req, res)});

router.get('/GetProposalDetailsById/:multiSigAddr', async(req: Request, res: Response) => { await GetProposalDetailsById(req, res)});
router.post('/CreateProposal/:multiSigAddr',  async (req: Request, res: Response) => {await CreateProposal(req, res)});
//upvoting a proposal
router.post('/UpvoteProposalById/:multiSigAddr', async (req: Request, res: Response) =>{ await  UpvoteProposalById(req, res)});
//downvoting a proposal
router.post('/DownvoteProposalById/:multiSigAddr', async(req: Request, res: Response) => { await DownVoteProposalById(req, res)});
//Get all proposals from a DAO
export default router;
