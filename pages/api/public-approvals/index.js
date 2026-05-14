import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "../../../lib/db-connect";
import Album from "../../../models/album";
import PublicApprovalRequest from "../../../models/publicApprovalRequest";
import { createToken, daysFromNow, hashToken } from "../../../lib/tokens";
import { queueEmail } from "../../../lib/email-outbox";
import { writeAuditLog } from "../../../lib/audit";

const canRequestPublic = (album, sessionUser) => {
  if (!album || !sessionUser) return false;
  return sessionUser.role === "admin" || album.owner?.toString() === sessionUser.id;
}

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
      : { requestedBy: req.sessionUser.id };
    const approvals = await PublicApprovalRequest.find(query).sort({ createdAt: -1 }).limit(50);
    return res.status(200).json(approvals);
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { albumId, parentConsentEmail } = req.body;

  if (!albumId || !parentConsentEmail) {
    return res.status(400).json({ message: "Album and parent consent email are required." });
  }

  const album = await Album.findById(albumId);

  if (!canRequestPublic(album, req.sessionUser)) {
    return res.status(403).json({ message: "You do not have permission to request public sharing for this album." });
  }

  const token = createToken();
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const approvalUrl = `${baseUrl}/approve/public/${token}`;
  const approval = await PublicApprovalRequest.create({
    targetType: "album",
    targetId: album._id,
    album: album._id,
    requestedBy: req.sessionUser.id,
    requestedByRole: req.sessionUser.role,
    accountHolderEmail: req.sessionUser.email,
    parentConsentEmail,
    tokenHash: hashToken(token),
    previousVisibility: album.visibility,
    requestedVisibility: "public",
    approvalUrl,
    expiresAt: daysFromNow(7),
    ipAddress: req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
    userAgent: req.headers["user-agent"],
  });

  album.visibility = album.visibility === "public" ? "public" : "private";
  album.publicApproval = {
    status: "pending_email",
    requestedAt: new Date(),
    approvedByEmail: parentConsentEmail,
    requestId: approval._id,
    approvalUrl,
    legalNoticeVersion: "public-sharing-disclaimer-v1",
  };
  album.updatedAt = new Date();
  await album.save();

  await queueEmail({
    to: parentConsentEmail,
    subject: "Approve public sharing for a Toddlerfaces album",
    template: "public_album_parent_consent",
    payload: {
      albumTitle: album.title,
      requestedBy: req.sessionUser.email,
      requestedByRole: req.sessionUser.role,
      approvalUrl,
      expiresAt: approval.expiresAt,
    },
  });

  await writeAuditLog(req, "public_approval_requested", {
    targetType: "album",
    targetId: album._id,
    album: album._id,
    metadata: {
      parentConsentEmail,
      approvalRequestId: approval._id,
      requestedByRole: req.sessionUser.role,
    },
  });

  return res.status(201).json({ approval, message: "Parent consent email queued." });
}
