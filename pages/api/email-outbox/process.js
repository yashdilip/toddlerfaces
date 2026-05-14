import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "../../../lib/db-connect";
import { processQueuedEmails } from "../../../lib/email-outbox";

export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (error) {
    return res.status(500).json({ message: "Connection failed." });
  }

  const session = await getServerSession(req, res, authOptions);

  if (session?.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed." });
  }

  const results = await processQueuedEmails({ limit: Number(req.body?.limit || 25) });
  return res.status(200).json({ results, message: "Email outbox processed." });
}
