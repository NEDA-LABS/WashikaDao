import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { QueryFailedError } from "typeorm"; // Import QueryFailedError for catching unique constraint violations
import AppDataSource from "../data-source";
import { Dao } from "../entities/Dao";
import { MemberDetails } from "../entities/MemberDetails";

// Repositories for accessing various entities in the database
const memberDetailsRepository = AppDataSource.getRepository(MemberDetails);
const daoRepository = AppDataSource.getRepository(Dao);


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
    });
  }

  return await memberDetailsRepository.save(member);
}

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
