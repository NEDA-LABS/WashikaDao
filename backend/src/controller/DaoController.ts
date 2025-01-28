import { Request, Response } from "express";
import { Dao } from "../entity/Dao";
import { AppDataSource } from "../data-source";
import { GlobalErrorHandler } from "../ErrorHandling/GlobalExceptionHandler";
import { CreateCustomErrMsg } from "../ErrorHandling/CustomErrorHandler";

/**
 * Creates a new DAO (Decentralized Autonomous Organization) and saves its details to the database.
 * It also creates a new member detail for the creator of the DAO.
 * @param req - The Express request object containing the DAO and member details in the request body.
 * @param res - The Express response object to send back the HTTP response.
 *
 * @remarks
 * The function extracts the DAO and member details from the request body, validates them,
 * and saves them to the database. It handles errors and returns appropriate HTTP responses.
 *
 * @returns
 * - HTTP 201: If the DAO and member details are successfully created and saved.
 * - HTTP 400: If any required fields are missing in the request body.
 * - HTTP 500: If an error occurs while creating or saving the DAO and member details.
 */
export async function CreateNewDao(req: Request, res: Response) {
  // Extract DAO details from request body
  const {
    daoName,
    daoLocation,
    targetAudience,
    daoTitle,
    daoDescription,
    daoOverview,
    daoImageIpfsHash,
    daoRegDocs,
    multiSigAddr,
    multiSigPhoneNo,
    kiwango, //Amount
    accountNo,
    nambaZaHisa,
    kiasiChaHisa,
    interestOnLoans,
  } = req.body;

  // Validate required DAO fields
  if (
    !daoName ||
    !daoLocation ||
    !targetAudience ||
    !daoTitle ||
    !daoDescription ||
    !daoOverview ||
    !daoImageIpfsHash ||
    !daoRegDocs ||
    !multiSigAddr ||
    !multiSigPhoneNo ||
    !kiwango ||
    !accountNo ||
    !nambaZaHisa ||
    !kiasiChaHisa ||
    !interestOnLoans
  ) {
    return res.status(400).json({ error: "Missing required DAO details" });
  }

  const daoRepository = AppDataSource.getRepository(Dao);
 //function to check whether dao exists or not and returns a boolean
 async function doesDaoWithThisMsigExist(_daoMultiSigAddr: any):Promise<boolean> {
    const _doesMsigExist = await daoRepository.findOne({ where: { daoMultiSigAddr: multiSigAddr }, });
        if (_doesMsigExist) {
            return true;
        }
        return false;
    }
    const doesMsigExist: boolean = await doesDaoWithThisMsigExist(multiSigAddr);
    if (doesMsigExist === true) {
     return res
      .status(400)
      .json({ error: "DAO with this multiSigAddr already exists." });
    }

  try {
    // Save DAO details to the database
    const dao = new Dao();
    dao.daoName = daoName;
    dao.daoLocation = daoLocation;
    dao.targetAudience = targetAudience;
    dao.daoTitle = daoTitle;
    dao.daoDescription = daoDescription;
    dao.daoOverview = daoOverview;
    dao.daoImageIpfsHash = daoImageIpfsHash;
    dao.daoRegDocs = daoRegDocs;
    dao.daoMultiSigAddr = multiSigAddr;
   // dao.daoMultiSigs = multiSigAddr; // Assuming it's an array of multisigs
    dao.multiSigPhoneNo = multiSigPhoneNo;
    dao.kiwango = kiwango;
    dao.accountNo = accountNo;
    dao.nambaZaHisa = nambaZaHisa;
    dao.kiasiChaHisa = kiasiChaHisa;
    dao.interestOnLoans = interestOnLoans;

    const createdDao =  daoRepository.create(dao);
    // Initialize the DAO repository
    await daoRepository.save(createdDao);

   return   res
            .status(201)
            .json({  message: "DAO created  successfully",  daoMultisigAddr: dao.daoMultiSigAddr  });
  } catch (error) {
    console.log("Error creating DAO ", error);
     return res
            .status(500)
            .json({ error: "Error creating DAO" });
  }
}

/**
 * Retrieves a list of all DAOs (Decentralized Autonomous Organizations) from the database.
 * NOTE: This function is meant to provide an overview of each DAO for frontend display purposes.
 *
 * @param req - The Express request object.
 * @param res - The Express response object to send back the HTTP response.
 *
 * @returns
 * - HTTP 200: If the DAO list is successfully retrieved, it returns an array of DAOs.
 * - HTTP 500: If an error occurs while retrieving the DAO list.
 */
export async function GetAllDaosInPlatform(req: Request, res: Response) {
  try {
    const daoRepository = AppDataSource.getRepository(Dao);
    // Fetch all DAOs
    const daoList = await daoRepository.find();
    return res.status(200).json({ daoList });
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving DAO list" });
  }
}

/**
 * Retrieves the details of a DAO (Decentralized Autonomous Organization) based on the provided multi-signature address.
 * NOTE: Break down into 2 steps, start onchain and check some details from db, the db one will be specifically for displaying daos in the frontend, say for a user to scroll through, the onchain one will be used when client searches & wants to get into the details of a certain Dao.
 * @param req - The Express request object containing the DAO multi-signature address in the request parameters.
 * @param res - The Express response object to send back the HTTP response.
 *
 * @remarks
 * The function extracts the multi-signature address from the request parameters.
 * It validates the required field, fetches the DAO details from the database, and returns them in the response.
 * If the DAO is not found, it returns a 404 status with an appropriate error message.
 * If any error occurs during the process, it returns a 500 status with an error message.
 *
 * @returns
 * - HTTP 200: If the DAO details are successfully retrieved. The response body contains the DAO details.
 * - HTTP 400: If the required multi-signature address is missing in the request parameters.
 * - HTTP 404: If the DAO with the given multi-signature address is not found.
 * - HTTP 500: If an error occurs while retrieving the DAO details.
 */
export async function GetDaoDetailsByMultisig(req: Request, res: Response) {
  const daoMultiSigAddr: string = req.params.daoMultiSigAddr;

  if (!daoMultiSigAddr) {
    return res.status(400).json({ message: "Missing required params!" });
  }

  try {
    const daoRepository = AppDataSource.getRepository(Dao);
    const daoDetails = await daoRepository.findOneBy({ daoMultiSigAddr });

    if (daoDetails) {
      return res.status(200).json({
        message: "DAO found with the details below",
        daoDetails: {
          daoId: daoDetails.daoId,
          daoName: daoDetails.daoName,
          daoLocation: daoDetails.daoLocation,
          targetAudience: daoDetails.targetAudience,
          daoTitle: daoDetails.daoTitle,
          daoDescription: daoDetails.daoDescription,
          daoOverview: daoDetails.daoOverview,
          daoImageIpfsHash: daoDetails.daoImageIpfsHash,
          daoRegDocs: daoDetails.daoRegDocs,
          //daoMultiSigs: daoDetails.daoMultiSigs,
          multiSigAddr: daoDetails.daoMultiSigAddr,
          multiSigPhoneNo: daoDetails.multiSigPhoneNo,
          kiwango: daoDetails.kiwango,
          accountNo: daoDetails.accountNo,
          nambaZaHisa: daoDetails.nambaZaHisa,
          kiasiChaHisa: daoDetails.kiasiChaHisa,
          interestOnLoans: daoDetails.interestOnLoans,
        },
      });
    } else {
      return res.status(404).json({ message: "DAO not found" });
    }
  } catch (error) {
    console.error("Error finding DAO:", error);
    return res.status(500).json({ error: "Error finding DAO" });
  }
}

/**
 * Updates the details of an existing DAO (Decentralized Autonomous Organization) in the database.
 * NOTE: This is purely a backend details updating & should include implementation to disallow updating details about a dao that were published onchain, especially the crucial one, however should allow things like images, descriptions etc to be updated
 * @param req - The Express request object containing the DAO multi-signature address and updated details in the request parameters and body.
 * @param res - The Express response object to send back the HTTP response.
 *
 * @remarks
 * The function extracts the multi-signature address and updated details from the request parameters and body.
 * It validates the required fields, fetches the DAO details from the database, and updates them.
 * It handles errors and returns appropriate HTTP responses.
 *
 * @returns
 * - HTTP 200: If the DAO details are successfully updated.
 * - HTTP 400: If any required fields are missing in the request parameters or body.
 * - HTTP 404: If the DAO with the given multi-signature address is not found.
 * - HTTP 500: If an error occurs while updating the DAO details.
 */

export async function UpdateDaoDetails(req: Request, res: Response) {
  const { multiSigAddr } = req.params;
  if (!multiSigAddr) {
    return res.status(400).json({ error: "Missing required url params" }); //return 400 status if required fields are missing
  }

    const {
    _daoName,
    _daoLocation,
    _targetAudience,
    _daoTitle,
    _daoDescription,
    _daoOverview,
    _daoImageIpfsHash,
    _daoRegDocs,
    multiSigPhoneNo,
    kiwango,
    accountNo,
    nambaZaHisa,
    kiasiChaHisa,
    interestOnLoans,
  } = req.body;
  //so you have to manually update all the details if you are updating details
  //check missing details
  //TODO: Refactor to an extensible function or helper function in utils to check missing required
  if (
    !multiSigAddr ||
    !_daoName ||
    !_daoLocation ||
    !_targetAudience ||
    !_daoTitle ||
    !_daoDescription ||
    !_daoOverview ||
    !_daoImageIpfsHash ||
    !_daoRegDocs ||
    !multiSigPhoneNo ||
    !accountNo ||
    !nambaZaHisa ||
    !kiasiChaHisa ||
    !interestOnLoans
  ) {
    return res.status(400).json({ error: "Missing required in form details" }); //return 400 status if required fields are missing
  }

  try {
    const daoRepository = AppDataSource.getRepository(Dao);
    const daoDetails = await daoRepository.findOneBy({
      daoMultiSigAddr: multiSigAddr,
    });
    if (daoDetails.daoId === undefined) {
      return res.status(404).json({ message: "DAO not found" });
    }
    //daoID won't change when dao details are being updated  also not the way to add a multisig, a different method to add multisig will be implemented.
    daoDetails.daoName = _daoName;
    daoDetails.daoLocation = _daoLocation;
    daoDetails.targetAudience = _targetAudience;
    daoDetails.daoTitle = _daoTitle;
    daoDetails.daoDescription = _daoDescription;
    daoDetails.daoOverview = _daoOverview;
    daoDetails.daoImageIpfsHash = _daoImageIpfsHash;
    daoDetails.multiSigPhoneNo = multiSigPhoneNo;
    daoDetails.kiwango = kiwango;
    daoDetails.accountNo = accountNo;
    daoDetails.nambaZaHisa = nambaZaHisa;
    daoDetails.kiasiChaHisa = kiasiChaHisa;
    daoDetails.interestOnLoans = interestOnLoans;
    await daoRepository.save(daoDetails);
    res.status(200).json({ message: "DAO details updated" });
  } catch (err) {
    res.status(500).json({ error: "Error updating DAO" });
  }
}

/**
 * Processes a fund request for a specific DAO (Decentralized Autonomous Organization).
 *
 * @param req - The Express request object containing the DAO multi-signature address and fund details in the request parameters and body.
 * @param res - The Express response object to send back the HTTP response.
 *
 * @remarks
 * The function extracts the multi-signature address and fund details from the request parameters and body.
 * It validates the required fields, fetches the DAO details from the database, and processes the fund request.
 * It handles errors and returns appropriate HTTP responses.
 *
 * @returns
 * - HTTP 200: If the fund request is successfully processed.
 * - HTTP 400: If any required fields are missing in the request parameters or body.
 * - HTTP 404: If the DAO with the given multi-signature address is not found.
 * - HTTP 500: If an error occurs while processing the fund request.
 */
export async function FundDao(req: Request, res: Response) {
  const  _daoMultiSig  = req.params.multiSigAddr; //Dao to fund
  const fundData = req.body;
  if (!_daoMultiSig) {
    return res.status(400).json({ error: "Missing required url params" }); //return 400 status if required fields are missing  //TODO: this should be a validation middleware function  to prevent potential errors
  }
  const { funderAddr, fundAmount } = req.body; //funder and the amount they want to fund
  try {
    //TODO: mechanisms to transfer funds goes here
    //check if fundAmount is a positive number
     if (fundAmount <= 0) {
         return res.status(400).json({ error: 'Invalid fund amount' });
    }
    //check if funderAddr is valid
    //check if fundAmount is sufficient
    //update the fundAmount in the DAO model
    //add the funderAddr to the daoMultisigs array
    //save the updated DAO model to the database
    //send a notification to all the members in the DAO about the new fund request
    //use a blockchain function & Transaction for ease even to check balance

    //Use thirdparty funding api & check response using webhook or callback.
    const daoRepository = AppDataSource.getRepository(Dao);
    const daoDetails = await daoRepository.findOneBy({
      daoMultiSigAddr: _daoMultiSig,
    });
    if (!daoDetails) {
      return res.status(404).json({ message: "DAO not found" });
    }
    //after crosschecked with the blockchain transaction/function

    res.status(200).json({ message: "Funding successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error funding DAO Due to an internal Server Error" });
  }
}

export async function GetAllDaoFunds(req: Request, res: Response){
 console.log("I am yet to be implemented");
}
