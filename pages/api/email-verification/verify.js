import { dbConnect } from "../../../lib/db-connect";
import User from "../../../models/user";
import { hashToken } from "../../../lib/tokens";

export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (error) {
    return res.status(500).json({ message: "Connection failed." });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Verification token is required." });
  }

  const user = await User.findOne({ "emailVerification.tokenHash": hashToken(token) });

  if (!user) {
    return res.status(404).json({ message: "Verification link is invalid." });
  }

  if (user.emailVerification?.expiresAt && user.emailVerification.expiresAt < new Date()) {
    return res.status(410).json({ message: "Verification link expired." });
  }

  user.emailVerifiedAt = new Date();
  user.emailVerification = undefined;
  user.updatedAt = new Date();
  await user.save();

  return res.status(200).json({ message: "Email verified." });
}
