const express = require('express') 
const router = express.Router()
const ProposalController = require("../controllers/proposal-controller"); 
import { Request, Response } from "express"; 

//Creating  a new proposal 
router.post('/daoDetails/:multiSigAddr/createProposal', (req: Request, res: Response) => ProposalController.CreateProposal(req, res)); 
//searching for a proposal by their id 
router.get('/daoDetails/:multiSigAddr/proposal/:proposalId', (req: Request, res: Response) => ProposalController.GetProposalDetailsById(req, res)); 
//upvoting a proposal
router.put('/daoDetails/:multiSigAddr/proposal/:proposalId/upvote', (req: Request, res: Response) => ProposalController.UpvoteProposalById(req, res));
//downvoting a proposal
router.put('/daoDetails/:multiSigAddr/proposal/:proposalId/downvote', (req: Request, res: Response) => ProposalController.DownvoteProposalById(req, res)); 
//Get all proposals from a DAO  
router.get('/daoDetails/:multiSigAddr/proposals', (req: Request, res: Response) => ProposalController.GetAllProposalsInDao(req, res));



