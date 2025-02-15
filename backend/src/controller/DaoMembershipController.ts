import { Request, Response } from "express";
import { QueryFailedError } from "typeorm"; // Import QueryFailedError for catching unique constraint violations
import AppDataSource from "../data-source";
import { Dao } from "../entity/Dao";
import {
  DaoJoinDate,
  DaoMembershipStatus,
  DaoRole,
  DaoStatus,
} from "../entity/DaoMembershipRelations";
import { MemberDetails } from "../entity/MemberDetails";

const memberDetailsRepository = AppDataSource.getRepository(MemberDetails);
const daoRepository = AppDataSource.getRepository(Dao);
const daoStatusRepository = AppDataSource.getRepository(DaoStatus);
const joinDateRepository = AppDataSource.getRepository(DaoJoinDate);
const roleRepository = AppDataSource.getRepository(DaoRole);

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
  const { daoMultiSigAddr } = req.query;
  const { firstName, lastName, email, phoneNumber, nationalIdNo, memberAddr } =
    req.body;

  if (typeof daoMultiSigAddr !== "string") {
    return res
      .status(400)
      .json({ error: "Invalid or missing daoMultiSigAddr" });
  }
  // Validate required fields
  if (!firstName || !lastName || !memberAddr) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let dao = await daoRepository.findOne({
    where: { daoMultiSigAddr },
    relations: ["members"],
  });

  try {
    let initialOwner = await memberDetailsRepository.findOne({
      where: { memberAddr },
      relations: ["daos"],
    });

    if (initialOwner) {
      // If the user exists, update their DAO relationships
      if (
        !initialOwner.daos.some((d) => d.daoMultiSigAddr === daoMultiSigAddr)
      ) {
        initialOwner.daos.push(dao);
        await memberDetailsRepository.save(initialOwner);
      }
    } else {
      // If the user does not exist, create a new entry
      initialOwner = memberDetailsRepository.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        nationalIdNo,
        memberAddr,
        daos: dao ? [dao] : [],
      });
      await memberDetailsRepository.save(initialOwner);
    }

    const daoStatus = daoStatusRepository.create({
      dao,
      member: initialOwner,
      status: DaoMembershipStatus.APPROVED,
    });

    await daoStatusRepository.save(daoStatus);

    // Add join date
    const daoJoinDate = joinDateRepository.create({
      dao,
      member: initialOwner,
      joinDate: new Date(),
    });

    await joinDateRepository.save(daoJoinDate);

    // Assign role
    const daoRole = roleRepository.create({
      dao,
      member: initialOwner,
      role: "Chairperson",
    });

    await roleRepository.save(daoRole);

    return res.status(201).json({
      message: "Initial owner created successfully",
    });
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
  const { daoMultiSigAddr } = req.query;
  const { firstName, lastName, email, phoneNumber, nationalIdNo, memberAddr } =
    req.body;

  if (!daoMultiSigAddr || typeof daoMultiSigAddr !== "string") {
    return res.status(400).json({ error: " Missing MultiSig address." }); // Return error for missing address
  }

  try {
    const foundDaoByMultiSig = await daoRepository.findOne({
      where: { daoMultiSigAddr },
      relations: ["members"],
    });

    if (!foundDaoByMultiSig) {
      return res.status(404).json({ error: "DAO not found" });
    }

    let memberRequest = await memberDetailsRepository.findOne({
      where: { memberAddr },
      relations: ["daos"],
    });

    if (!memberRequest) {
      memberRequest = memberDetailsRepository.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        nationalIdNo,
        memberAddr,
        daos: [foundDaoByMultiSig],
      });
      await memberDetailsRepository.save(memberRequest);
    } else {
      // If the member exists but is not part of this DAO, add them
      if (
        !memberRequest.daos.some(
          (dao) => dao.daoId === foundDaoByMultiSig.daoId
        )
      ) {
        memberRequest.daos.push(foundDaoByMultiSig);
        await memberDetailsRepository.save(memberRequest);
      }
    }

    // Check if member already has a pending request
    const existingStatus = await daoStatusRepository.findOne({
      where: { dao: foundDaoByMultiSig, member: memberRequest },
    });

    if (existingStatus) {
      return res
        .status(400)
        .json({ error: "You have already requested to join this DAO." });
    }

    // Create a pending request in DaoStatus
    const daoStatus = daoStatusRepository.create({
      dao: foundDaoByMultiSig,
      member: memberRequest,
      status: DaoMembershipStatus.PENDING,
    });

    await daoStatusRepository.save(daoStatus);

    // Assign role
    const daoRole = roleRepository.create({
      dao: foundDaoByMultiSig,
      member: memberRequest,
      role: "Member",
    });

    await roleRepository.save(daoRole);

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
export async function WhiteListUser(
  req: Request,
  res: Response
): Promise<Response> {
  const { daoMultiSigAddr } = req.query;
  const { memberAddr } = req.body;

  // Validate required fields
  if (!daoMultiSigAddr || typeof daoMultiSigAddr !== "string" || !memberAddr) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const daoToBeAddedTo = await daoRepository.findOne({
      where: { daoMultiSigAddr },
      relations: ["members"],
    });

    if (!daoToBeAddedTo) {
      return res.status(404).json({ error: "DAO not found" });
    }

    const member = await memberDetailsRepository.findOne({
      where: { memberAddr },
      relations: ["daos"],
    });

    if (!member) {
      return res.status(404).json({ error: "Member request not found." });
    }

    const daoStatus = await daoStatusRepository.findOne({
      where: { dao: daoToBeAddedTo, member },
    });

    if (!daoStatus || daoStatus.status !== DaoMembershipStatus.PENDING) {
      return res.status(400).json({ error: "No pending request found." });
    }

    daoStatus.status = DaoMembershipStatus.APPROVED;
    await daoStatusRepository.save(daoStatus);

    // Add join date
    const daoJoinDate = joinDateRepository.create({
      dao: daoToBeAddedTo,
      member,
      joinDate: new Date(),
    });

    await joinDateRepository.save(daoJoinDate);

    member.daos.push(daoToBeAddedTo);
    await memberDetailsRepository.save(member);

    return res
      .status(200)
      .json({ message: "Member added successfully to DAO" });
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
export async function BlackListMember(
  req: Request,
  res: Response
): Promise<Response> {
  const { daoMultiSigAddr } = req.query;
  const { memberAddr } = req.body; //dao to delete user from
  if (!daoMultiSigAddr || typeof daoMultiSigAddr !== "string" || !memberAddr) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  try {
    // Retrieve the DAO first
    const daoDetails = await daoRepository.findOne({
      where: { daoMultiSigAddr },
      relations: ["members"],
    });

    if (!daoDetails) {
      return res.status(404).json({ error: "DAO not found" });
    }

    // Find the member by the address
    const memberToDelete = await memberDetailsRepository.findOne({
      where: { memberAddr },
      relations: ["daos"],
    });
    if (!memberToDelete) {
      return res.status(404).json({ message: "Member not found." });
    }
    // Check if the member is actually in the DAO
    const isMember = daoDetails.members.some(
      (m) => m.memberId === memberToDelete.memberId
    );

    if (!isMember) {
      return res.status(404).json({ message: "Member is not in this DAO." });
    }

    const dao = daoDetails;
    const member = memberToDelete;

    const daoStatus = await daoStatusRepository.findOne({
      where: { dao, member },
    });

    if (!daoStatus) {
      return res.status(400).json({ error: "No pending request found." });
    }

    await daoStatusRepository.remove(daoStatus);

    // Remove the relationship in the join table
    memberToDelete.daos = memberToDelete.daos.filter(
      (existingDao) => existingDao.daoId !== daoDetails.daoId
    );
    await memberDetailsRepository.save(memberToDelete);

    return res
      .status(200)
      .json({ message: "Member removed from DAO successfully" });
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
  const { daoMultiSigAddr } = req.query;

  if (!daoMultiSigAddr || typeof daoMultiSigAddr !== "string") {
    return res.status(400).json({ error: "Missing DAO MultiSig address." });
  }

  try {
    const dao = await daoRepository.findOne({
      where: { daoMultiSigAddr },
      relations: ["members"],
    });

    if (!dao) {
      return res.status(404).json({ error: "DAO not found" });
    }

    const members = dao.members;

    const memberCount = members.length;

    if (memberCount === 0) {
      return res.status(404).json({
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
