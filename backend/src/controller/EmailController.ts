import { Request, Response } from "express";
const nodemailer = require("nodemailer");

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
  const { email, firstName } = req.body;

  try {
    await sendEmail(
      email,
      "Welcome to Wanakikundi",
      `Hi ${firstName},\n\nYou have been added to Wanakikundi. Welcome aboard!`
    );
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
};
