import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "../../../lib/db-connect";
import Image from "../../../models/Image";
import Album from "../../../models/album";
import { writeAuditLog } from "../../../lib/audit";

export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (error) {
    return res.status(500).json({ message: "Connection failed." });
  }

  const session = await getServerSession(req, res, authOptions);
  req.sessionUser = session?.user || null;

  if (req.sessionUser?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }

  if (req.method === "GET") {
    const images = await Image.find({ moderationStatus: { $in: ["pending", "needs_review", "failed_scan"] } })
      .sort({ createdAt: -1 })
      .limit(100);
    return res.status(200).json(images);
  }

  if (req.method === "PUT") {
    const { id } = req.query;
    const { moderationStatus, moderationNote } = req.body;

    if (!["approved", "needs_review", "blocked", "failed_scan"].includes(moderationStatus)) {
      return res.status(400).json({ message: "Invalid moderation status." });
    }

    const image = await Image.findByIdAndUpdate(id, {
      moderationStatus,
      moderationNote,
      updatedAt: new Date(),
    }, { new: true, runValidators: true });

    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }

    const album = await Album.findById(image.album);
    await writeAuditLog(req, "media_moderation_reviewed", {
      targetType: "image",
      targetId: image._id,
      album: album?._id,
      metadata: {
        moderationStatus,
        moderationNote,
      },
    });

    return res.status(200).json({ image, message: "Moderation status updated." });
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ message: "Method not allowed." });
}
