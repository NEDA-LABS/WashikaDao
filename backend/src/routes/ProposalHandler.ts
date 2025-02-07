const express = require('express')
const router = express.Router()
const ProposalController = require('../controller/ProposalController');

import { Request, Response } from "express";
import { authenticator } from "../utils/Authenticator/Authenticator";
//TODO: Include better documentation for this feature
//Creating  a new proposal
router.post('/DaoDetails/:multiSigAddr/createProposal', authenticator,  (req: Request, res: Response) => {ProposalController.CreateProposal(req, res)});
//searching for a proposal by their id
router.get('/DaoDetails/:multiSigAddr/proposal/:proposalId', (req: Request, res: Response) => ProposalController.GetProposalDetailsById(req, res));
//upvoting a proposal
router.post('/DaoDetails/:multiSigAddr/proposal/:proposalId/upvote', authenticator, (req: Request, res: Response) => ProposalController.UpvoteProposalById(req, res));
//downvoting a proposal
router.post('/DaoDetails/:multiSigAddr/proposal/:proposalId/downvote', authenticator, (req: Request, res: Response) => ProposalController.DownVoteProposalById(req, res));
//Get all proposals from a DAO
router.get('/DaoDetails/:multiSigAddr/proposals', (req: Request, res: Response) => ProposalController.GetAllProposalsInDao(req, res));



module.exports = router ;
