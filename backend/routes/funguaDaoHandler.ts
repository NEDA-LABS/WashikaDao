const router = require('express').Router();
const createDaoController = require("../controllers/createDao");
import { Request, Response } from "express";

//Views -> To the React 
//TODO: Refactor to handle returning json data so that the client can consume
router.post('/createDao', (req, res) => createDaoController.createDao(req, res)
); 
