import { Request, Response } from "express";
import nodemailer from "nodemailer";

const sendEmail = async (email: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOptions);
};

export const handleSendInvite = async (req: Request, res: Response) => {
  const { email, firstName, member } = req.body;

  const platformUrl = "https://washikadao.xyz/";
  const inviteLink = `${platformUrl}?member=${member}`;

  const emailBody = `
    Hi ${firstName},

    You have been added to Wanakikundi. Welcome aboard!

    Click the link below to complete your registration:
    ${inviteLink}

    If you didn’t request this, please ignore this email.

    Best,
    WashikaDao Team
  `;

  try {
    await sendEmail(email, "Welcome to Wanakikundi", emailBody);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
};


