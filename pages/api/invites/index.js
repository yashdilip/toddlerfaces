import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "../../../lib/db-connect";
import Album from "../../../models/album";
import User from "../../../models/user";
import ShareInvite from "../../../models/shareInvite";
import { createToken, daysFromNow, hashToken } from "../../../lib/tokens";
import { queueEmail } from "../../../lib/email-outbox";
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

  if (req.method === "GET") {
    const query = req.sessionUser.role === "admin"
      ? {}
      : { invitedBy: req.sessionUser.id };
    const invites = await ShareInvite.find(query).sort({ createdAt: -1 }).limit(50);
    return res.status(200).json(invites);
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { albumId, invitedEmail, role = "viewer" } = req.body;

  if (!albumId || !invitedEmail) {
    return res.status(400).json({ message: "Album and invite email are required." });
  }

  const album = await Album.findById(albumId);
  const canInvite = req.sessionUser.role === "admin" || album?.owner?.toString() === req.sessionUser.id;

  if (!canInvite) {
    return res.status(403).json({ message: "You do not have permission to invite people to this album." });
  }

  const invitedUser = await User.findOne({ email: invitedEmail });
  const token = createToken();
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const inviteUrl = `${baseUrl}/share/invite/${token}`;
  const invite = await ShareInvite.create({
    album: album._id,
    invitedEmail,
    invitedUser: invitedUser?._id,
    invitedBy: req.sessionUser.id,
    role,
    tokenHash: hashToken(token),
    expiresAt: daysFromNow(14),
  });

  await queueEmail({
    to: invitedEmail,
    subject: "You were invited to a Toddlerfaces album",
    template: "album_invite",
    payload: {
      albumTitle: album.title,
      invitedBy: req.sessionUser.email,
      inviteUrl,
      expiresAt: invite.expiresAt,
    },
  });

  await writeAuditLog(req, "album_invite_created", {
    targetType: "album",
    targetId: album._id,
    album: album._id,
    metadata: { invitedEmail, role, inviteId: invite._id },
  });

  return res.status(201).json({ invite, inviteUrl, message: "Invite email queued." });
}
