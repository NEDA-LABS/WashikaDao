import express from "express";
const router = express.Router()

import { GetProposalDetails, GetAllProposalsInDao, CreateProposal, UpVoteProposal, DownVoteProposal } from "../controller/ProposalController";

import { Request, Response } from "express";
import { Authenticator } from "../utils/Authenticator/Authenticator";

//TODO: Include better documentation for this feature


router.get('/GetAllProposalsInDao/:daoMultiSigAddr', async(req: Request, res: Response) => {await GetAllProposalsInDao(req, res)});

router.get('/GetProposalDetails/:daoMultiSigAddr/:proposalCustomIdentifier', async(req: Request, res: Response) => { await GetProposalDetails(req, res)});
router.post('/CreateProposal', Authenticator,  async (req: Request, res: Response) => {await CreateProposal(req, res)});
//upvoting a proposal
router.post('/UpVoteProposal', Authenticator, async (req: Request, res: Response) =>{ await  UpVoteProposal(req, res)});
//downvoting a proposal
router.post('/DownVoteProposal', Authenticator, async(req: Request, res: Response) => { await DownVoteProposal(req, res)});
//Get all proposals from a DAO
export default router;
