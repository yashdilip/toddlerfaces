import { Schema, models, model } from "mongoose";

const publicApprovalRequestSchema = new Schema({
  targetType: {
    type: String,
    enum: ["album", "image"],
    required: true,
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: "Album",
  },
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  requestedByRole: String,
  accountHolderEmail: {
    type: String,
    required: true,
  },
  parentConsentEmail: {
    type: String,
    required: true,
  },
  tokenHash: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "expired", "cancelled", "rejected"],
    default: "pending",
  },
  previousVisibility: String,
  requestedVisibility: {
    type: String,
    default: "public",
  },
  approvalUrl: String,
  expiresAt: {
    type: Date,
    required: true,
  },
  approvedAt: Date,
  approvedByEmail: String,
  ipAddress: String,
  userAgent: String,
  legalNoticeVersion: {
    type: String,
    default: "public-sharing-disclaimer-v1",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.PublicApprovalRequest || model("PublicApprovalRequest", publicApprovalRequestSchema);
