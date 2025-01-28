import express from "express";
const router = express.Router()
import * as ProposalController from "../controller/ProposalController";

import { GetProposalDetailsById, GetAllProposalsInDao, CreateProposal, UpvoteProposalById, DownVoteProposalById } from "../controller/ProposalController";

import { Request, Response } from "express";
import { RouteOAuthManager } from "../utils/Authenticator/Authenticator";
//TODO: Include better documentation for this feature


router.get('/DaoDetails/:multiSigAddr/Proposals', async(req: Request, res: Response) => {await GetAllProposalsInDao(req, res)});

router.get('/DaoKit/:multiSigAddr/Proposals/:proposalId', async(req: Request, res: Response) => { await GetProposalDetailsById(req, res)});
router.post('/DaoKit/:multiSigAddr/Proposals/CreateProposal',  async (req: Request, res: Response) => {await CreateProposal(req, res)});
//upvoting a proposal
router.post('/DaoKit/:multiSigAddr/Proposals/:proposalId/Vote/Upvote', async (req: Request, res: Response) =>{ await  ProposalController.UpvoteProposalById(req, res)});
//downvoting a proposal
router.post('/DaoDetails/:multiSigAddr/proposal/:proposalId/Vote/Downvote', async(req: Request, res: Response) => { await DownVoteProposalById(req, res)});
//Get all proposals from a DAO
export default router;
