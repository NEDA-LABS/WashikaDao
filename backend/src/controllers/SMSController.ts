import { Request, Response } from "express";
const twilio = require("twilio")

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from Twilio
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from Twilio
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio phone number

const client = twilio(accountSid, authToken);

const sendSms = async (to: string, message: string) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to, // Recipient's phone number
    });
    console.log("SMS sent successfully:", response.sid);
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
};

export const handleSendInviteSMS = async (req: Request, res: Response) => {
  const { phoneNumber, firstName } = req.body;

  try {
    await sendSms(
      phoneNumber,
      `Hi ${firstName},\n\nYou have been added to Wanakikundi. Welcome aboard!`
    );
    res.status(200).json({ message: "SMS sent successfully." });
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({ error: "Failed to send SMS." });
  }
};
