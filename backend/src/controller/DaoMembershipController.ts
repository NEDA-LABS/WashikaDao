import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { QueryFailedError } from "typeorm"; // Import QueryFailedError for catching unique constraint violations
import AppDataSource from "../data-source";
import { Dao } from "../entity/Dao";
import {
  DaoJoinDate,
  DaoMembershipStatus,
  DaoRole,
  DaoRoleEnum,
  DaoStatus,
} from "../entity/DaoMembershipRelations";
import { MemberDetails } from "../entity/MemberDetails";

// Repositories for accessing various entities in the database
const memberDetailsRepository = AppDataSource.getRepository(MemberDetails);
const daoRepository = AppDataSource.getRepository(Dao);
const daoStatusRepository = AppDataSource.getRepository(DaoStatus);
const joinDateRepository = AppDataSource.getRepository(DaoJoinDate);
const roleRepository = AppDataSource.getRepository(DaoRole);

/**
 * Finds an existing member or creates a new member based on unique identifiers.
 *
 * @param data - The data containing member details to find or create.
 * @param dao - The DAO to associate the member with.
 * @returns - The saved member details.
 */
async function findOrCreateMember(data: Partial<MemberDetails>, dao: Dao) {
  const {
    memberAddr,
    email,
    phoneNumber,
    nationalIdNo,
    firstName,
    lastName,
    memberCustomIdentifier,
  } = data;

  // Try to find an existing member with the given identifiers
  let member = await memberDetailsRepository.findOne({
    where: {
      memberAddr: memberAddr || undefined,
      email: email || undefined,
      phoneNumber: phoneNumber || undefined,
      nationalIdNo: nationalIdNo || undefined,
    },
    relations: ["daos"],
  });

  if (!member) {
    // Create a new member if none found
    member = memberDetailsRepository.create({
      memberCustomIdentifier: memberCustomIdentifier,
      firstName,
      lastName,
      email,
      phoneNumber,
      nationalIdNo,
      memberAddr,
      daos: [dao],
    });
  } else if (
    !member.daos.some((d) => d.daoMultiSigAddr === dao.daoMultiSigAddr)
  ) {
    // If the member doesn't belong to the DAO, add the DAO to their list
    member.daos.push(dao);
  }

  return await memberDetailsRepository.save(member);
}

/**
 * Assigns a role, membership status, and join date to a member of a DAO.
 *
 * @param dao - The DAO the member is being added to.
 * @param member - The member being added to the DAO.
 * @param role - The role the member will assume in the DAO.
 */
async function assignMembershipDetails(
  dao: Dao,
  member: MemberDetails,
  role: DaoRoleEnum,
  status: DaoMembershipStatus = DaoMembershipStatus.APPROVED
) {
  // Save the role, status, and join date information for the member
  await Promise.all([
    roleRepository.save(roleRepository.create({ dao, member, role })),
    daoStatusRepository.save(
      daoStatusRepository.create({
        dao,
        member,
        status,
      })
    ),
    joinDateRepository.save(
      joinDateRepository.create({
        dao,
        member,
        joinDate: new Date().toISOString(),
      })
    ),
  ]);
}

/**
 * Sends an invitation email to a member to join the DAO platform.
 *
 * @param email - The email address of the member to invite.
 * @param firstName - The first name of the member.
 * @param memberIdentifier - The unique identifier for the member.
 * @param daoName - The name of the DAO the member is being invited to.
 */
async function sendInviteEmail(
  email: string,
  firstName: string,
  memberIdentifier: string,
  daoName: string
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const platformUrl = "https://washikadao.xyz/";
    const inviteLink = `${platformUrl}?member=${memberIdentifier}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Welcome to ${daoName}`,
      text: `
        Hi ${firstName},

        You have been added to ${daoName}. Welcome aboard!

        Click the link below to connect your wallet:
        ${inviteLink}

        If you didn’t request this, please ignore this email.

        Best,
        WashikaDao Team
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Failed to send invite email to ${email}: `, error);
    throw new Error("Failed to send invitation email. Please try again later.");
  }
}

/**
 * Creates the initial admins of a DAO, assigning them specific roles such as Chairperson, Treasurer, and Secretary.
 *
 * @param dao - The DAO being created.
 * @param members - The list of members to be assigned to the DAO.
 * @param creatorAddress - The address of the DAO creator.
 * @returns - The list of successfully created members.
 *
 * @remarks
 * This function ensures that a DAO has exactly three members with specific roles.
 */
export async function CreateDaoAdmins(
  dao: Dao,
  members: any[],
  creatorAddress: string
) {
  if (!Array.isArray(members) || members.length < 3) {
    throw new Error(
      "A DAO must have a Chairperson, Treasurer, and a Secretary."
    );
  }

  const requiredRoles = [
    DaoRoleEnum.CHAIRPERSON,
    DaoRoleEnum.TREASURER,
    DaoRoleEnum.SECRETARY,
  ];
  const hasRoles = requiredRoles.every((role) =>
    members.some((m) => m.memberRole === role)
  );

  if (!hasRoles) {
    throw new Error(
      "A DAO must have a Chairperson, Treasurer, and a Secretary."
    );
  }

  try {
    await Promise.all(
      members.map(async (member) => {
        if (member.memberRole === DaoRoleEnum.CHAIRPERSON) {
          member.memberAddr = creatorAddress;
        }
        const user = await findOrCreateMember(member, dao);
        await assignMembershipDetails(dao, user, member.memberRole);

        // For Treasurer and Secretary, if no address is provided, send an invite email.
        if (
          (member.memberRole === DaoRoleEnum.TREASURER ||
            member.memberRole === DaoRoleEnum.SECRETARY) &&
          (!user.memberAddr || user.memberAddr === "")
        ) {
          try {
            await sendInviteEmail(
              member.email,
              member.firstName,
              member.memberCustomIdentifier,
              dao.daoName
            );
          } catch (emailError) {
            console.error(
              `Failed to send invite email to ${member.email}: `,
              emailError
            );
          }
        }
      })
    );

    return members;
  } catch (error) {
    console.error("Error creating DAO admins:", error);

    // Handle database constraint errors for fields such as email, phone number, etc.
    if (error instanceof QueryFailedError) {
      if (error.message.includes("phoneNumber"))
        return "The phone number is already in use.";
      if (error.message.includes("nationalIdNo"))
        return "The national ID number is already in use.";
      if (error.message.includes("email"))
        return "The email is already in use.";
      if (error.message.includes("memberAddr"))
        return "The member address is already in use.";
    }

    throw new Error("Error creating DAO admins");
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
  const { daoTxHash } = req.query;
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    nationalIdNo,
    memberRole,
    memberAddr,
    memberCustomIdentifier
  } = req.body;

  if (!daoTxHash || typeof daoTxHash !== "string") {
    return res.status(400).json({ error: "Missing DaoTxHash" });
  }

  try {
    // Find the DAO by its transaction hash
    const dao = await daoRepository.findOneBy({ daoTxHash });
    if (!dao) {
      return res.status(404).json({ error: "DAO not found" });
    }

    // Prepare the member request details
    const memberRequest = {
      firstName,
      lastName,
      email,
      phoneNumber,
      nationalIdNo,
      memberRole,
      memberAddr,
      memberCustomIdentifier
    };

    // Create or find an existing member and ensure the DAO relation is added
    const member = await findOrCreateMember(memberRequest, dao);

    // Check if a join request (DaoStatus) already exists for this dao and member.
    const existingDaoStatus = await daoStatusRepository.findOne({
      where: { dao, member },
    });
    if (existingDaoStatus) {
      return res
        .status(400)
        .json({ error: "A join request for this member already exists." });
    }

    // Create a DaoStatus entry with a pending status
    await daoStatusRepository.save(
      daoStatusRepository.create({
        dao,
        member,
        status: DaoMembershipStatus.PENDING,
      })
    );

    // Check if a role record already exists for this member in this DAO.
    const existingDaoRole = await roleRepository.findOne({
      where: { dao, member },
    });
    if (!existingDaoRole) {
      // Determine the role based on memberRole input:
      // If memberRole equals "Funder" (case-insensitive), assign Funder, otherwise assign Member.
      const roleToAssign =
        memberRole && memberRole.toLowerCase() === "funder"
          ? DaoRoleEnum.FUNDER
          : DaoRoleEnum.MEMBER;

      // Create a DaoRole entry with the determined role
      await roleRepository.save(
        roleRepository.create({
          dao,
          member,
          role: roleToAssign,
        })
      );
    }

    res
      .status(201)
      .json({ message: "Request to join DAO successfully submitted." });
  } catch (error) {
    console.error("Error processing join request:", error);
    res.status(500).json({ error: "Error processing request to join DAO" });
  }
}

/**
 * Add a new member to the DAO.
 *
 * This endpoint is intended for use by an admin (Chairperson, Treasurer, or Secretary)
 * to directly add a new member. The DAO is identified by its TxHash (daoTxHash),
 * and the caller’s member address (adminMemberAddr) is used to verify authorization.
 *
 * Expected query parameters:
 * - daoTxHash: string
 * - adminMemberAddr: string
 *
 * Expected body (JSON) includes the new member’s details:
 * - memberCustomIdentifier, firstName, lastName, email, phoneNumber, nationalIdNo, memberAddr (optional)
 *
 * @param req Express Request
 * @param res Express Response
 */
export async function AddMember(
  req: Request,
  res: Response
): Promise<Response> {
  // Get the DAO TxHash address and admin's member address from the query string
  const { daoTxHash, adminMemberAddr } = req.query;
  const newMemberData = req.body;

  // Validate required query parameters
  if (
    !daoTxHash ||
    typeof daoTxHash !== "string" ||
    !adminMemberAddr ||
    typeof adminMemberAddr !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "Missing required DAO or admin info." });
  }

  try {
    // Fetch the DAO along with its roles and members
    const dao = await daoRepository.findOne({
      where: { daoTxHash },
      relations: ["daoRoles", "daoRoles.member", "members"],
    });
    console.log(dao);

    if (!dao) {
      return res.status(404).json({ error: "DAO not found." });
    }

    // Verify that the admin making the request has one of the allowed roles
    const isAdmin = dao.daoRoles.some(
      (role) =>
        (role.role === DaoRoleEnum.CHAIRPERSON ||
          role.role === DaoRoleEnum.TREASURER ||
          role.role === DaoRoleEnum.SECRETARY) &&
        role.member.memberAddr === adminMemberAddr
    );

    if (!isAdmin) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Only DAO admins can add members." });
    }

    // Check if the member already exists in the DAO (approved membership)
    const existingMember = await memberDetailsRepository.findOne({
      where: { phoneNumber: newMemberData.phoneNumber },
      relations: ["daos"],
    });

    if (existingMember) {
      // See if this member already has an approved status in this DAO
      const existingStatus = await daoStatusRepository.findOne({
        where: { dao, member: existingMember },
      });
      if (
        existingStatus &&
        existingStatus.status === DaoMembershipStatus.APPROVED
      ) {
        return res.status(400).json({ error: "Member is already in the DAO." });
      }
    }

    // Find or create the member record
    const member = await findOrCreateMember(newMemberData, dao);

    // Assign membership details with the default role "Member"
    await assignMembershipDetails(dao, member, DaoRoleEnum.MEMBER);

    // Ensure the member's DAO list is updated
    if (!member.daos.some((d) => d.daoMultiSigAddr === dao.daoMultiSigAddr)) {
      member.daos.push(dao);
      await memberDetailsRepository.save(member);
    }

    // Optionally, if no on-chain address is provided, send an invite email
    if (!member.memberAddr || member.memberAddr.trim() === "") {
      try {
        await sendInviteEmail(
          member.email,
          member.firstName,
          member.memberCustomIdentifier,
          dao.daoName
        );
      } catch (emailError) {
        console.error(
          `Failed to send invite email to ${member.email}: `,
          emailError
        );
      }
    }

    return res
      .status(201)
      .json({ message: "Member added successfully", member });
  } catch (error) {
    console.error("Error adding member:", error);

    if (error instanceof QueryFailedError) {
      if (error.message.includes("phoneNumber"))
        return res
          .status(400)
          .json({ error: "The phone number is already in use." });
      if (error.message.includes("nationalIdNo"))
        return res
          .status(400)
          .json({ error: "The national ID number is already in use." });
      if (error.message.includes("email"))
        return res.status(400).json({ error: "The email is already in use." });
      if (error.message.includes("memberAddr"))
        return res
          .status(400)
          .json({ error: "The member address is already in use." });
    }

    return res.status(500).json({ error: "Error adding member." });
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

    await assignMembershipDetails(daoToBeAddedTo, member, DaoRoleEnum.MEMBER);

    member.daos = [...(member.daos || []), daoToBeAddedTo];
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
 * This function retrieves the daoTxHash from the request parameters and fetches all members associated with the DAO.
 * It checks if the required parameter is provided and fetches the DAO details using the daoTxHash.
 * If the DAO is found, it returns a list of members associated with the DAO.
 * If any error occurs during the process, it returns an appropriate error message.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {string} req.params.daoTxHash - The daoTxHash of the DAO for which to retrieve members.
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
  const { daoTxHash } = req.query;

  if (!daoTxHash || typeof daoTxHash !== "string") {
    return res.status(400).json({ error: "Missing DAO MultiSig address." });
  }

  try {
    const dao = await daoRepository.findOne({
      where: { daoTxHash },
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
