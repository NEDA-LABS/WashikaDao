const router = require('express').Router();
const createDaoController = require("../controllers/createDao");
//Views -> To the React
//TODO: Refactor to handle returning json data so that the client can consume
router.post('/createDao', (req, res) => createDaoController.createDao(req, res));
router.get('/insideDao/:multiSigAddr', (req, res) => createDaoController.getDaoDetails(req, res));
export {};
