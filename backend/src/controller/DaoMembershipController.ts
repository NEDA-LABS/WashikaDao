import { eventNames } from "process";
//import { daoContract, publicClient } from "./config.ts";
import { Request, Response } from "express";
import { QueryFailedError } from "typeorm"; // Import QueryFailedError for catching unique constraint violations
import { Dao } from "../entity/Dao";
import { Proposal } from "../entity/Proposal";
import { Vote } from "../entity/Vote";
import { MemberDetails } from "../entity/MemberDetails";
import { AppDataSource } from "../data-source";
import { IDao, IMemberDetails } from "../Interfaces/EntityTypes";
import { In, ObjectLiteral } from "typeorm";

const memberDetailsRepository = AppDataSource.getRepository(MemberDetails);
const daoRepository = AppDataSource.getRepository(Dao);

/**
 * Creates the initial owner of a DAO, setting them as a InitialDaoOwner.
 *
 * @param req - The Express request object containing the body with owner details.
 * @param res - The Express response object to send the HTTP response.
 *
 * @remarks
 * This function is responsible for creating the initial owner of a DAO with InitialDaoOwner privileges.
 * It retrieves necessary information from the request body, validates required fields, and creates the owner.
 *
 * @returns
 * - If required fields are missing, it returns a 400 status code with an error message.
 * - If the owner is successfully created, it returns a 201 status code with a success message.
 * - If any error occurs, it returns a 500 status code with the error message.
 */
export async function CreateInitialOwner(req: Request, res: Response) {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    memberRole,
    nationalIdNo,
    memberAddr,
    daoMultiSig,
    daos,
  } = req.body;
  console.log("Request Body:", req.body);
  // Validate required fields
  if (!firstName || !lastName || !memberAddr) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Create initial owner with InitialDaoOwner role
    const initialOwner: Partial<MemberDetails> = {
      firstName,
      lastName,
      email,
      phoneNumber,
      nationalIdNo,
      memberRole, // Setting role as InitialDaoOwner
      memberAddr,
      daos, // This will be filled after DAO creation
      daoMultiSig,
    };

    const createdOwner = memberDetailsRepository.create(initialOwner);
    await memberDetailsRepository.save(createdOwner);

    return res.status(201).json({ message: "Dao Owner created successfully" });
  } catch (error) {
    console.error("Error creating Dao owner:", error);
    // Check if the error is due to a unique constraint violation
    if (error instanceof QueryFailedError && error.message.includes("UNIQUE")) {
      // Customize the error message based on which field is duplicated
      let errorMessage = "A unique constraint was violated.";
      if (error.message.includes("phoneNumber")) {
        errorMessage = "The phone number is already in use.";
      } else if (error.message.includes("nationalIdNo")) {
        errorMessage = "The national ID number is already in use.";
      } else if (error.message.includes("email")) {
        errorMessage = "The email is already in use.";
      } else if (error.message.includes("memberAddr")) {
        errorMessage = "The member address is already in use.";
      }

      return res.status(409).json({ error: errorMessage });
    }
    res.status(500).json({ error: error.message });
  }
}

/**
 * Logs in an existing member by verifying their memberAddr.
 *
 * @param req - The Express request object containing the body with login credentials.
 * @param res - The Express response object to send the HTTP response.
 *
 * @remarks
 * This function is responsible for authenticating a member using their memberAddr.
 * It checks if the provided memberAddr exists in the database and returns a successful login message if found.
 *
 * @returns
 * - If memberAddr is missing, it returns a 400 status code with an error message.
 * - If memberAddr is not found in the database, it returns a 404 status code with an error message.
 * - If login is successful, it returns a 200 status code with a success message and member details.
 */
export async function loginMember(req: Request, res: Response) {
  const { memberAddr } = req.body;

  // Validate required fields
  if (!memberAddr) {
    return res.status(400).json({ error: "Member address is required" });
  }

  try {
    // Check if a member with the given memberAddr exists
    const member = await memberDetailsRepository.findOne({
      where: { memberAddr },
    });

    if (!member) {
      // If member is not found, return an error message
      return res
        .status(404)
        .json({
          error:
            "Member not found. Please check the member address and try again.",
        });
    }

    // If member exists, return a success message and member details (without sensitive data)
    return res.status(200).json({
      message: "Login successful",
      member: {
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phoneNumber: member.phoneNumber,
        memberRole: member.memberRole,
        memberAddr: member.memberAddr,
        daoMultiSig: member.daoMultiSig,
      },
    });
  } catch (error) {
    console.error("Error logging in member:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while logging in. Please try again later.",
      });
  }
}

/**
 * Adds a new multisig address to a DAO.
 *
 * @param req - The Express request object containing the parameters and body.
 * @param res - The Express response object to send the HTTP response.
 *
 * @remarks
 * This function is responsible for adding a new multisig address to a DAO.
 * It retrieves the DAO's multiSigAddr from the request parameters and the addressToAdd from the request body.
 * It then finds the DAO by its multiSigAddr, checks if the required parameters are provided, and adds the new multisig address to the DAO.
 *
 * @returns
 * - If the required parameters are missing, it returns a 400 status code with an error message.
 * - If the DAO is not found, it returns a 404 status code with an error message.
 * - If the new multisig address is successfully added, it returns a 200 status code with a success message.
 * - If any other error occurs, it returns a 400 status code with the error message.
 */
export async function AddAnotherMultisigToDao(req: Request, res: Response) {
  const { _daoMultiSigAddr } = req.params; //dao to add multisig address, process of adding new owner
  if (!_daoMultiSigAddr) {
    return res.status(400).json({ error: "Missing required daoMultiSigAddr" });
  }
  const { addressToAdd } = req.body;
  if (!addressToAdd) {
    return res.status(400).json({ error: "Missing required addressToAdd" });
  }
  try {
    //find dao by multiSigAddr
    const daoDetails: IDao | ObjectLiteral =
      await memberDetailsRepository.findOneBy({
        daoMultiSig: _daoMultiSigAddr,
      });
    if (!daoDetails || daoDetails.daoMultiSig === undefined) {
      return res.status(404).json({ error: "DAO not found" });
    }
    //add the new owner to the dao, multisigs are part of the dao details
    await daoDetails.daoMultiSigs[_daoMultiSigAddr].push(addressToAdd);
    await daoDetails.update(daoDetails);
    return res
      .status(200)
      .json({ message: "Added " + addressToAdd + "successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Handles the request to join a DAO.
 *
 * @param req - The Express request object containing the parameters and body.
 * @param res - The Express response object to send the HTTP response.
 *
 * @remarks
 * This function is responsible for processing a request to join a DAO.
 * It retrieves the DAO's multiSigAddr from the request parameters and the necessary details from the request body.
 * It then checks if the required parameters are provided, finds the DAO by its multiSigAddr, and sends a request to join the DAO.
 *
 * @returns
 * - If the required parameters are missing, it returns a 400 status code with an error message.
 * - If the DAO is not found, it returns a 404 status code with an error message.
 * - If the request to join the DAO is successfully sent, it returns a 201 status code with a success message.
 * - If any other error occurs, it returns a 500 status code with the error message.
 */
export async function RequestToJoinDao(req: Request, res: Response) {
  const { _daoMultiSigAddr } = req.params;
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    nationalIdNo,
    memberRole,
    memberAddr,
    memberDaos, // This is an array of DAO names from the frontend
    daoMultiSig,
  } = req.body;

  console.log(req.body);

  if (!daoMultiSig) {
    return res.status(400).json({ error: "MultiSig address is required." }); // Return error for missing address
  }

  try {
    const findDaoByMultiSig = await memberDetailsRepository.findOneBy({
      daoMultiSig: _daoMultiSigAddr,
    });

    if (!findDaoByMultiSig) {
      return res.status(404).json({ error: "DAO not found" });
    }

    // Treat empty memberAddr as null
    const sanitizedMemberAddr =
      memberAddr && memberAddr.trim() !== "" ? memberAddr : null;

    // Create the member request entry
    const memberRequest = {
      firstName,
      lastName,
      email,
      phoneNumber,
      nationalIdNo,
      memberRole,
      sanitizedMemberAddr,
      daoMultiSig,
      daos: memberDaos,
    };

    console.log({ memberRequest });

    // Save the member request
    await memberDetailsRepository.save(memberRequest);

    // Send request for the address to be added to the whitelist
    res.status(201).json({ message: "Request sent to join DAO successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error sending request to join DAO" });
  }
}

//TODO: add registry for whitelist

/**
 * Adds a new member to a DAO's whitelist.
 *
 * @param req - The Express request object containing the parameters and body.
 * @param res - The Express response object to send the HTTP response.
 *
 * @remarks
 * This function is responsible for adding a new member to a DAO's whitelist.
 * It retrieves the DAO's multiSigAddr from the request parameters and the member details from the request body.
 * It then checks if the required parameters are provided, finds the DAO by its multiSigAddr, and adds the new member to the whitelist.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {string} req.params._daoMultiSig - The multiSigAddr of the DAO to add the member to.
 * @param {typeof MemberDetails} req.body - The details of the member to be added.
 *
 * @returns {Response}
 * - If the required parameters are missing, it returns a 400 status code with an error message.
 * - If the DAO is not found, it returns a 404 status code with an error message.
 * - If the member is successfully added to the whitelist, it returns a 200 status code with a success message.
 * - If any other error occurs, it returns a 500 status code with the error message.
 */
export async function WhiteListUser(req: Request, res: Response): Promise<Response> {
  const { _daoMultiSig } = req.params;
  const memberDetails: typeof MemberDetails = req.body;

  // Validate required fields
  if (!memberDetails.firstName) {
    return res.status(400).json({ error: "Missing required field: firstName" });
  }

  try {
    const daoToBeAddedTo = await daoRepository.findOneBy({
      daoMultiSigAddr: _daoMultiSig,
    });

    if (!daoToBeAddedTo) {
      return res.status(404).json({ error: "DAO not found" });
    }

    // Create and save the new member
    const createdMember = memberDetailsRepository.create(memberDetails);
    await memberDetailsRepository.save(createdMember);

    // Update DAO with the new member
    daoToBeAddedTo.members.push(createdMember); // Assuming members is an array in DAO entity
    await daoRepository.save(daoToBeAddedTo); // Save the updated DAO

    return res
      .status(200)
      .json({ message: "Member added successfully/whitelist success" });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ error: "Error adding member" });
  }
}

//function to delete a member from the dao
/**
 * Deletes a member from a DAO's whitelist.
 *
 * @remarks
 * This function retrieves the DAO's multiSigAddr and the address of the member to be deleted from the request parameters.
 * It then checks if the required parameters are provided, finds the DAO by its multiSigAddr, and deletes the member from the whitelist.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {string} req.params.multiSigAddr - The multiSigAddr of the DAO from which to delete the member.
 * @param {string} req.params.memberAddr - The address of the member to be deleted.
 *
 * @returns {Response}
 * - If the required parameters are missing, it returns a 400 status code with an error message.
 * - If the DAO is not found, it returns a 404 status code with an error message.
 * - If the member is successfully deleted from the whitelist, it returns a 200 status code with a success message.
 * - If any other error occurs, it returns a 500 status code with the error message.
 */
export async function BlackListMember(req: Request, res: Response): Promise<Response> {
  const { multiSigAddr, memberAddr } = req.params; //dao to delete user from
  if (!multiSigAddr || !memberAddr) {
    return res.status(400).json({ error: "Missing required" });
  }
  try {
    // Retrieve the DAO first
    const daoDetails = await daoRepository.findOneBy({
      daoMultiSigAddr: multiSigAddr,
    });
    if (!daoDetails || !daoDetails.daoMultiSigAddr === undefined) {
      return res.status(404).json({ error: "DAO not found" });
    }

    // Find the member by the address
    const memberToDelete = await memberDetailsRepository.findOne({
      where: { memberAddr },
    });
    if (
      !memberToDelete ||
      daoDetails.members.some((m) => m.memberId === memberToDelete.memberId)
    ) {
      return res
        .status(404)
        .json({ message: `Member with address ${memberAddr}` });
    }
    // Remove the member from the DAO's list of members
    daoDetails.members = daoDetails.members.filter(
      (m) => m.memberId !== memberToDelete.memberId
    );
    // Update the DAO
    await daoRepository.save(daoDetails);
    return res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal Server Error Occurred When Deleting Member" });
  }
}

/**
 * Retrieves all members associated with a specific DAO.
 *
 * @remarks
 * This function retrieves the multiSigAddr from the request parameters and fetches all members associated with the DAO.
 * It checks if the required parameter is provided and fetches the DAO details using the multiSigAddr.
 * If the DAO is found, it returns a list of members associated with the DAO.
 * If any error occurs during the process, it returns an appropriate error message.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {string} req.params.multiSigAddr - The multiSigAddr of the DAO for which to retrieve members.
 *
 * @returns {Response}
 * - If the required parameter is missing, it returns a 400 status code with an error message.
 * - If the DAO is not found, it returns a 400 status code with an error message.
 * - If the members are successfully retrieved, it returns a 200 status code with a list of members.
 * - If any other error occurs, it returns a 500 status code with the error message.
 */
export async function GetAllMembers(
  req: Request,
  res: Response
): Promise<Response> {
  const daoMultiSigAddr: string = req.params.daoMultiSigAddr;
  console.log("daoMultiSigAddr:", daoMultiSigAddr);

  if (!daoMultiSigAddr) {
    return res.status(400).json({ error: "Missing required parameter" });
  }

  try {
    // Fetch members with the matching daoMultiSig using AppDataSource
    const memberRepository = AppDataSource.getRepository(MemberDetails);
    const members = await memberRepository.find({
      where: { daoMultiSig: daoMultiSigAddr },
      relations: ["daos"],
    });

    const memberCount = members.length;

    if (memberCount === 0) {
      return res
        .status(404)
        .json({
          error: "No members found for the specified DAO multisig address",
        });
    }

    return res.status(200).json({ members, memberCount });
  } catch (error) {
    console.error("Error fetching members:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error Occurred When Fetching Members" });
  }
}
