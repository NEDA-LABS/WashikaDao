import express, { Express } from 'express';
import { Request, Response } from "express";
import { CreateDao, GetAllDaosInPlatform } from '../controller/DaoController';
const router = express.Router();
import { Authenticator } from '../utils/Authenticator/Authenticator';

/**
 * Handles the creation of a new DAO.
 *
 * @remarks
 * This route is responsible for processing a POST request to create a new DAO, GET a specific or all Daos, Update a certain Dao.
 * WARN: No Inside of Dao activities should be contained here
 * The request body should contain the necessary information to initialize the DAO.
 * Deleting a Dao is not allowed since it is already onchain -- further implementations will be added
 * @param req - The Express request object containing the incoming request data.
 * @param res - The Express response object used to send a response back to the client.
 *
 * @returns {void} - This function does not return a value.
 * It sends a response back to the client indicating the success or failure of the DAO creation process.
 */

router.post('/CreateDao', Authenticator, async (req: Request, res: Response) =>{await CreateDao(req, res)});//INFO: Unique route that is only used for creating Daos

router.get('/GetAllDaos', Authenticator,  async (req: Request, res: Response) => {await GetAllDaosInPlatform(req, res)});//INFO: provides all the available Daos within the application, used for rendering say a certain no of daos & extended to more dao viewing functionality within the client

export default router;

