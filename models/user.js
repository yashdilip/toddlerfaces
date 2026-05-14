import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["parent", "photographer", "admin"],
    default: "parent",
    required: true,
  },
  birthMonth: {
    type: Number,
    min: 1,
    max: 12,
    required: true,
  },
  birthYear: {
    type: Number,
    required: true,
  },
  adultAttestedAt: {
    type: Date,
    required: true,
  },
  legalAcceptedAt: {
    type: Date,
    required: true,
  },
  emailVerifiedAt: {
    type: Date,
  },
  emailVerification: {
    tokenHash: String,
    expiresAt: Date,
    sentAt: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default models.User || model('User', userSchema)
