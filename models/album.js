import { Schema, models, model } from "mongoose";

const albumSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default models.Album || model('Album', albumSchema)