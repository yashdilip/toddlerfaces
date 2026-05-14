import { Schema, models, model } from "mongoose";

const auditLogSchema = new Schema({
  actor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  actorEmail: String,
  actorRole: String,
  action: {
    type: String,
    required: true,
  },
  targetType: String,
  targetId: String,
  album: {
    type: Schema.Types.ObjectId,
    ref: "Album",
  },
  child: {
    type: Schema.Types.ObjectId,
    ref: "Child",
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
  policyVersions: {
    terms: String,
    privacy: String,
    childPrivacy: String,
    publicSharing: String,
    uploadAttestation: String,
  },
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.AuditLog || model("AuditLog", auditLogSchema);
