import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "../../../lib/db-connect";
import AuditLog from "../../../models/auditLog";

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

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed." });
  }

  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
  return res.status(200).json(logs);
}
