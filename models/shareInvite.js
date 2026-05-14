import { Schema, models, model } from "mongoose";

const shareInviteSchema = new Schema({
  album: {
    type: Schema.Types.ObjectId,
    ref: "Album",
    required: true,
  },
  invitedEmail: {
    type: String,
    required: true,
  },
  invitedUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["viewer", "contributor"],
    default: "viewer",
  },
  tokenHash: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "revoked", "expired"],
    default: "pending",
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  acceptedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.ShareInvite || model("ShareInvite", shareInviteSchema);
