const router = require('express').Router; 
const ProposalController = require("../controllers/proposal-controller"); 
import { Request, Response } from "express"; 

router.post('/', (req: Request, res: Response) => ProposalController.CreateProposal(req, res)); 
router.get('/:proposalId', (req: Request, res: Response) => ProposalController.GetProposalDetailsById(req, res)); 
router.put('/:proposalId/upvote', (req: Request, res: Response) => ProposalController.UpvoteProposalById(req, res));
router.put('/:proposalId/downvote', (req: Request, res: Response) => ProposalController.DownvoteProposalById(req, res)); 
