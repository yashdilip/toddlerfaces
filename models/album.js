import { Schema, models, model } from "mongoose";

const albumSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: "",
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "Child",
    },
  ],
  childName: {
    type: String,
    default: "",
  },
  occasion: {
    type: String,
    enum: ["birthday", "milestone", "family", "photographer_delivery", "school", "custom"],
    default: "custom",
  },
  visibility: {
    type: String,
    enum: ["private", "shared", "public"],
    default: "private",
  },
  mediaProvider: {
    type: String,
    enum: ["google_drive", "dropbox", "onedrive", "s3", "photographer_gallery", "external_url", "local_dev"],
    default: "external_url",
  },
  mediaSourceUrl: {
    type: String,
    default: "",
  },
  storageMode: {
    type: String,
    enum: ["external_reference", "local_dev"],
    default: "external_reference",
  },
  mood: {
    type: String,
    default: "warm",
  },
  publicApproval: {
    status: {
      type: String,
      enum: ["not_requested", "pending_email", "approved", "rejected", "revoked"],
      default: "not_requested",
    },
    requestedAt: Date,
    approvedAt: Date,
    approvedByEmail: String,
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "PublicApprovalRequest",
    },
    approvalUrl: String,
    legalNoticeVersion: String,
  },
  legalAudit: [
    {
      action: String,
      actorRole: String,
      attestationVersion: String,
      acceptedAt: Date,
      ipAddress: String,
      userAgent: String,
      sourceProvider: String,
      sourceUrl: String,
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  sharedWith: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
  ],
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

export default models.Album || model('Album', albumSchema)
