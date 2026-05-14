import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "../../../lib/db-connect";
import Child from "../../../models/child";
import { writeAuditLog } from "../../../lib/audit";

export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (error) {
    return res.status(500).json({ message: "Connection failed." });
  }

  const session = await getServerSession(req, res, authOptions);
  req.sessionUser = session?.user || null;

  if (!req.sessionUser) {
    return res.status(401).json({ message: "Please sign in." });
  }

  if (!["parent", "admin"].includes(req.sessionUser.role)) {
    return res.status(403).json({ message: "Only parents and admins can manage child profiles." });
  }

  if (req.method === "GET") {
    const query = req.sessionUser.role === "admin" ? {} : { parent: req.sessionUser.id };
    const children = await Child.find(query).sort({ createdAt: -1 });
    return res.status(200).json(children);
  }

  if (req.method === "POST") {
    const { name, birthMonth, birthYear, notes } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Child name is required." });
    }

    const child = await Child.create({
      name,
      birthMonth,
      birthYear,
      notes,
      parent: req.sessionUser.id,
    });

    await writeAuditLog(req, "child_profile_created", {
      targetType: "child",
      targetId: child._id,
      child: child._id,
      metadata: { name, birthMonth, birthYear },
    });

    return res.status(201).json({ child, message: "Child profile created." });
  }

  if (req.method === "PUT") {
    const { id } = req.query;
    const existingChild = await Child.findById(id);

    if (!existingChild) {
      return res.status(404).json({ message: "Child profile not found." });
    }

    const canUpdate = req.sessionUser.role === "admin" || existingChild.parent?.toString() === req.sessionUser.id;

    if (!canUpdate) {
      return res.status(403).json({ message: "You do not have access to this child profile." });
    }

    const child = await Child.findByIdAndUpdate(id, { ...req.body, updatedAt: new Date() }, { new: true, runValidators: true });
    await writeAuditLog(req, "child_profile_updated", { targetType: "child", targetId: id, child: id });
    return res.status(200).json({ child, message: "Child profile updated." });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    const existingChild = await Child.findById(id);

    if (!existingChild) {
      return res.status(404).json({ message: "Child profile not found." });
    }

    const canDelete = req.sessionUser.role === "admin" || existingChild.parent?.toString() === req.sessionUser.id;

    if (!canDelete) {
      return res.status(403).json({ message: "You do not have access to this child profile." });
    }

    await Child.findByIdAndDelete(id);
    await writeAuditLog(req, "child_profile_deleted", { targetType: "child", targetId: id, child: id });
    return res.status(200).json({ message: "Child profile deleted." });
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  return res.status(405).json({ message: "Method not allowed." });
}
