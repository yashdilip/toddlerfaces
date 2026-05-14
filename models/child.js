import { Schema, models, model } from "mongoose";

const childSchema = new Schema({
  parent: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  birthMonth: {
    type: Number,
    min: 1,
    max: 12,
  },
  birthYear: {
    type: Number,
  },
  avatarImage: {
    type: Schema.Types.ObjectId,
    ref: "Image",
  },
  notes: {
    type: String,
    default: "",
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

export default models.Child || model("Child", childSchema);
