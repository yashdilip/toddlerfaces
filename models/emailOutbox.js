import { Schema, models, model } from "mongoose";

const emailOutboxSchema = new Schema({
  to: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  template: {
    type: String,
    required: true,
  },
  payload: {
    type: Schema.Types.Mixed,
    default: {},
  },
  status: {
    type: String,
    enum: ["queued", "sent", "failed"],
    default: "queued",
  },
  sentAt: Date,
  failureReason: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.EmailOutbox || model("EmailOutbox", emailOutboxSchema);
