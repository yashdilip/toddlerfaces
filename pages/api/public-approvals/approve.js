import { dbConnect } from "../../../lib/db-connect";
import Album from "../../../models/album";
import Image from "../../../models/Image";
import PublicApprovalRequest from "../../../models/publicApprovalRequest";
import AuditLog from "../../../models/auditLog";
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

  const { token, consentAccepted } = req.body;

  if (!token || !consentAccepted) {
    return res.status(400).json({ message: "Approval token and consent are required." });
  }

  const approval = await PublicApprovalRequest.findOne({ tokenHash: hashToken(token) });

  if (!approval) {
    return res.status(404).json({ message: "Approval link is invalid." });
  }

  if (approval.status !== "pending") {
    return res.status(409).json({ message: `Approval is already ${approval.status}.` });
  }

  if (approval.expiresAt < new Date()) {
    approval.status = "expired";
    approval.updatedAt = new Date();
    await approval.save();
    return res.status(410).json({ message: "Approval link expired." });
  }

  const album = await Album.findById(approval.album);

  if (!album) {
    return res.status(404).json({ message: "Album not found." });
  }

  const unsafeImages = await Image.find({
    album: album._id,
    moderationStatus: { $ne: "approved" },
  }).limit(1);

  if (unsafeImages.length) {
    return res.status(409).json({ message: "Album cannot become public until admin moderation approves all images." });
  }

  approval.status = "approved";
  approval.approvedAt = new Date();
  approval.approvedByEmail = approval.parentConsentEmail;
  approval.ipAddress = req.headers["x-forwarded-for"] || req.socket?.remoteAddress;
  approval.userAgent = req.headers["user-agent"];
  approval.updatedAt = new Date();
  await approval.save();

  album.visibility = "public";
  album.publicApproval = {
    status: "approved",
    requestedAt: approval.createdAt,
    approvedAt: approval.approvedAt,
    approvedByEmail: approval.parentConsentEmail,
    requestId: approval._id,
    approvalUrl: approval.approvalUrl,
    legalNoticeVersion: approval.legalNoticeVersion,
  };
  album.updatedAt = new Date();
  await album.save();

  await AuditLog.create({
    actor: approval.requestedBy,
    actorRole: approval.requestedByRole,
    actorEmail: approval.accountHolderEmail,
    action: "public_approval_granted",
    targetType: "album",
    targetId: album._id.toString(),
    album: album._id,
    metadata: {
      parentConsentEmail: approval.parentConsentEmail,
      approvalRequestId: approval._id,
      previousVisibility: approval.previousVisibility,
      requestedVisibility: approval.requestedVisibility,
    },
    policyVersions: {
      publicSharing: approval.legalNoticeVersion,
    },
    ipAddress: approval.ipAddress,
    userAgent: approval.userAgent,
  });

  return res.status(200).json({ message: "Album is now public.", album });
}
