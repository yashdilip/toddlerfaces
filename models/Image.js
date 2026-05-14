import { Schema, models, model } from "mongoose";

const imageSchema = new Schema({
  album: {
    type: Schema.Types.ObjectId,
    ref: "Album",
    required: true,
  },
  path: {
    type: String,
    default: "",
  },
  sourceUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    default: "",
  },
  provider: {
    type: String,
    enum: ["google_drive", "dropbox", "onedrive", "s3", "photographer_gallery", "external_url", "local_dev"],
    default: "external_url",
  },
  caption: {
    type: String,
    default: "",
  },
  visibility: {
    type: String,
    enum: ["inherit_album", "private", "public"],
    default: "inherit_album",
  },
  allowDownload: {
    type: Boolean,
    default: false,
  },
  moderationStatus: {
    type: String,
    enum: ["pending", "approved", "needs_review", "blocked", "failed_scan"],
    default: "pending",
  },
  moderationNote: {
    type: String,
    default: "",
  },
  uploadAttestation: {
    accepted: {
      type: Boolean,
      default: false,
    },
    acceptedAt: Date,
    textVersion: String,
    actorRole: String,
    ipAddress: String,
    userAgent: String,
  },
  sortOrder: {
    type: Number,
    default: 0,
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

export default models.Image || model('Image', imageSchema)
