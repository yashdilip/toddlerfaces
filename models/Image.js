import { Schema, models, model } from "mongoose";

const imageSchema = new Schema({
  album: {
    type: Schema.Types.ObjectId,
    ref: "Album",
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default models.Image || model('Image', userSchema)