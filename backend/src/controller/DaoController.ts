import { Request, Response } from "express";
import { Dao } from "../entity/Dao";
import { MemberDetails } from "../entity/MemberDetails";
import AppDataSource from "../data-source";
import { CreateDaoAdmins } from "./DaoMembershipController";
import { DaoRole, DaoRoleEnum } from "../entity/DaoMembershipRelations";

/**
 * Creates a new DAO (Decentralized Autonomous Organization) and saves its details to the database.
 * It also creates new member details for the admins of the DAO.
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
export async function CreateDao(req: Request, res: Response) {
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
    daoMultiSigAddr,
    multiSigPhoneNo,
    kiwango, //Amount
    accountNo,
    nambaZaHisa,
    kiasiChaHisa,
    interestOnLoans,
    daoTxHash,
    members, // Chairperson, Treasurer, Secretary
  } = req.body;

  // Validate required DAO fields
  if (
    !daoName ||
    !daoLocation ||
    !targetAudience ||
    !daoTitle ||
    !daoDescription ||
    !daoOverview ||
    !daoRegDocs ||
    !daoMultiSigAddr ||
    !multiSigPhoneNo ||
    !kiwango ||
    !accountNo ||
    !nambaZaHisa ||
    !kiasiChaHisa ||
    !interestOnLoans ||
    !daoTxHash ||
    !Array.isArray(members) ||
    members.length !== 3
  ) {
    throw new Error("Missing required DAO details or invalid members list");
  }

  const daoRepository = AppDataSource.getRepository(Dao);
  //function to check whether dao exists or not
  const existingDao = await daoRepository.findOne({
    where: { daoMultiSigAddr },
  });

  if (existingDao) {
    throw new Error("DAO with this daoMultiSigAddr already exists.");
  }

  try {
    // Save DAO details to the database
    const dao = daoRepository.create({
      daoName,
      daoLocation,
      targetAudience,
      daoTitle,
      daoDescription,
      daoOverview,
      daoImageIpfsHash,
      daoRegDocs,
      daoMultiSigAddr,
      multiSigPhoneNo,
      kiwango,
      accountNo,
      nambaZaHisa,
      kiasiChaHisa,
      interestOnLoans,
      daoTxHash,
    });

    await daoRepository.save(dao);
    // Retrieve the creator's address from the query parameters
    const currentAddress = req.query.currentAddr;
    if (!currentAddress || typeof currentAddress !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid currentAddr query parameter." });
    }

    // Pass the creator's address to the CreateDaoAdmins function
    await CreateDaoAdmins(dao, members, currentAddress);
    res.status(201).json({
      message:
        "DAO and admins (Chairperson, Treasurer, Secretary) created successfully",
      daoMultiSigAddr: dao.daoMultiSigAddr,
    });
  } catch (error) {
    console.error("Error creating DAO with members:", error);
    res.status(500).json({ error: error.message });
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
    const daoList = await daoRepository.find({
      relations: ["members"],
    });
    return res.status(200).json({ daoList });
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving DAO list" });
  }
}

/**
 * Retrieves the list of DAOs associated with a specific member and their roles within those DAOs.
 *
 * @param req - The Express request object containing the member address query parameter.
 * @param res - The Express response object used to send the response.
 * @returns - A JSON response containing the DAOs and roles associated with the member.
 *
 * @remarks
 * This function retrieves the DAOs that a member is associated with and the specific roles they hold
 * within those DAOs. It expects a query parameter `memberAddr` to identify the member and fetch the data
 * from the database. If the member is found, it returns the associated DAOs along with the roles.
 * If the member is not found or any errors occur, appropriate error responses are sent.
 */
export async function GetMemberDaos(req: Request, res: Response) {
  const { memberAddr } = req.query;
  if (!memberAddr || typeof memberAddr !== "string") {
    return res
      .status(400)
      .json({ error: "Missing or invalid memberAddr query parameter." });
  }
  try {
    const memberRepository = AppDataSource.getRepository(MemberDetails);
    const member = await memberRepository.findOne({
      where: { memberAddr },
      relations: ["daos", "daoRoles", "daoRoles.dao"],
    });
    if (!member) {
      return res.status(404).json({ error: "Member not found." });
    }
    // For each DAO, find the member’s role using the daoRoles relation.
    const daos = member.daos.map((dao) => {
      const roleEntry = member.daoRoles.find(
        (dr) => dr.dao.daoId === dao.daoId
      );
      return {
        daoTxHash: dao.daoTxHash,
        daoName: dao.daoName,
        role: roleEntry ? roleEntry.role : null,
        daoMultiSigAddr: dao.daoMultiSigAddr,
      };
    });

    const authCode = process.env.ROUTE_PROTECTOR;
    return res.status(200).json({ daos, member, authCode });
  } catch (error) {
    console.error("Error retrieving member DAOs:", error);
    return res.status(500).json({ error: "Error retrieving member DAOs." });
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
export async function GetDaoDetailsByDaoTxHash(req: Request, res: Response) {
  const { daoTxHash } = req.query;

  if (!daoTxHash || typeof daoTxHash !== "string") {
    return res
      .status(400)
      .json({ message: "Missing or invalid daoTxHash query parameter!" });
  }

  try {
    const daoRepository = AppDataSource.getRepository(Dao);
    const daoDetails = await daoRepository.findOne({
      where: { daoTxHash },
      relations: ["members", "daoRoles", "daoRoles.member"],
    });

    if (daoDetails) {
      // Get the Chairperson's memberAddr
      const chairpersonRole = daoDetails.daoRoles.find(
        (role) => role.role === DaoRoleEnum.CHAIRPERSON
      );
      const chairpersonAddr = chairpersonRole?.member?.memberAddr || null;

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
          daoMultiSigAddr: daoDetails.daoMultiSigAddr,
          multiSigPhoneNo: daoDetails.multiSigPhoneNo,
          kiwango: daoDetails.kiwango,
          accountNo: daoDetails.accountNo,
          nambaZaHisa: daoDetails.nambaZaHisa,
          kiasiChaHisa: daoDetails.kiasiChaHisa,
          interestOnLoans: daoDetails.interestOnLoans,
          daoTxHash: daoDetails.daoTxHash,
          members: daoDetails.members,
          chairpersonAddr,
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
  const { daoTxHash } = req.query;
  if (!daoTxHash || typeof daoTxHash !== "string") {
    return res.status(400).json({ error: "Missing required url params" }); //return 400 status if required fields are missing
  }

  const {
    daoName,
    daoLocation,
    targetAudience,
    daoTitle,
    daoDescription,
    daoOverview,
    daoImageIpfsHash,
    daoRegDocs,
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
    !daoTxHash ||
    !daoName ||
    !daoLocation ||
    !targetAudience ||
    !daoTitle ||
    !daoDescription ||
    !daoOverview ||
    !daoRegDocs ||
    !accountNo ||
    !nambaZaHisa ||
    !kiasiChaHisa ||
    !interestOnLoans
  ) {
    return res.status(400).json({ error: "Missing required in form details" }); //return 400 status if required fields are missing
  }

  try {
    const daoRepository = AppDataSource.getRepository(Dao);
    let _daoDetails;
    async function doesDaoWithThisMsigExist(_daoTxHash: any): Promise<boolean> {
      const _doesMsigExist = await daoRepository.findOne({
        where: { daoTxHash: _daoTxHash },
      });
      if (_doesMsigExist) {
        _daoDetails = _doesMsigExist;
        return true;
      }
      return false;
    }
    const doesMsigExist: boolean = await doesDaoWithThisMsigExist(daoTxHash);
    if (doesMsigExist === false) {
      return res
        .status(404)
        .json({ message: "Dao With that Multisig has not been found" });
    }
    const daoDetails = _daoDetails;
    //daoID won't change when dao details are being updated  also not the way to add a multisig, a different method to add multisig will be implemented.
    daoDetails.daoName = daoName;
    daoDetails.daoLocation = daoLocation;
    daoDetails.targetAudience = targetAudience;
    daoDetails.daoTitle = daoTitle;
    daoDetails.daoDescription = daoDescription;
    daoDetails.daoOverview = daoOverview;
    daoDetails.daoImageIpfsHash = daoImageIpfsHash;
    daoDetails.kiwango = kiwango;
    daoDetails.accountNo = accountNo;
    daoDetails.nambaZaHisa = nambaZaHisa;
    daoDetails.kiasiChaHisa = kiasiChaHisa;
    daoDetails.interestOnLoans = interestOnLoans;
    await daoRepository.save(daoDetails);
    res
      .status(200)
      .json({ message: ` Updated to ${[daoDetails]} details updated` });
  } catch (error) {
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
  const { daoMultiSigAddr, fundAmount } = req.body;
  console.log(fundAmount);
  if (!daoMultiSigAddr) {
    return res.status(400).json({ error: "Missing required multisig of Dao" }); //return 400 status if required fields are missing  //TODO: this should be a validation middleware function  to prevent potential errors
  }

  try {
    //TODO: mechanisms to transfer funds goes here
    //check if fundAmount is a positive number
    if (fundAmount <= 0) {
      return res
        .status(406)
        .json({ error: "Request Unacceptable, Invalid fund amount" });
    }

    //Use thirdparty funding api & check response using webhook or callback.
    const daoRepository = AppDataSource.getRepository(Dao);
    //function to check whether dao exists or not and returns a boolean
    async function _doesDaoWithThisMsigExist(
      _daoMultiSig: any
    ): Promise<boolean> {
      const _doesMsigExist = await daoRepository.findOne({
        where: { daoMultiSigAddr: _daoMultiSig },
      });
      if (_doesMsigExist) {
        return true;
      }
      return false;
    }
    const doesMsigExist: boolean = await _doesDaoWithThisMsigExist(
      daoMultiSigAddr
    );
    if (doesMsigExist === false) {
      return res.status(404).json({ message: "DAO not found" });
    }
    res.status(202).json({ message: "Funding successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error funding DAO Due to an internal Server Error" });
  }
}

export async function GetAllDaoFunds(req: Request, res: Response) {
  console.log("I am yet to be implemented");
}
