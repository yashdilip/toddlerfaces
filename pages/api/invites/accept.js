import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "../../../lib/db-connect";
import Album from "../../../models/album";
import ShareInvite from "../../../models/shareInvite";
import { hashToken } from "../../../lib/tokens";
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
    return res.status(401).json({ message: "Please sign in before accepting an invite." });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { token } = req.body;
  const invite = await ShareInvite.findOne({ tokenHash: hashToken(token) });

  if (!invite) {
    return res.status(404).json({ message: "Invite link is invalid." });
  }

  if (invite.status !== "pending") {
    return res.status(409).json({ message: `Invite is already ${invite.status}.` });
  }

  if (invite.expiresAt < new Date()) {
    invite.status = "expired";
    await invite.save();
    return res.status(410).json({ message: "Invite expired." });
  }

  if (invite.invitedEmail.toLowerCase() !== req.sessionUser.email?.toLowerCase()) {
    return res.status(403).json({ message: "This invite is for a different email address." });
  }

  const album = await Album.findById(invite.album);

  if (!album) {
    return res.status(404).json({ message: "Album not found." });
  }

  album.sharedWith.addToSet(req.sessionUser.id);
  if (album.visibility === "private") {
    album.visibility = "shared";
  }
  album.updatedAt = new Date();
  await album.save();

  invite.status = "accepted";
  invite.invitedUser = req.sessionUser.id;
  invite.acceptedAt = new Date();
  await invite.save();

  await writeAuditLog(req, "album_invite_accepted", {
    targetType: "album",
    targetId: album._id,
    album: album._id,
    metadata: { inviteId: invite._id },
  });

  return res.status(200).json({ album, message: "Invite accepted." });
}
