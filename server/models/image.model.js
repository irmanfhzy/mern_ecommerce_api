import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    trim: true,
  },

  publicId: {
    type: String,
    trim: true,
  },
});

export default imageSchema;
