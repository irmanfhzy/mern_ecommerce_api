import mongoose from "mongoose";
import addressSchema from "./address.model.js";
import imageSchema from "./image.model.js";

const contactSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
  },

  value: {
    type: String,
    required: true,
    trim: true,
  },

  link: {
    type: String,
    trim: true,
  },
});

const appSettingSchema = new mongoose.Schema(
  {
    appName: {
      type: String,
      required: true,
      trim: true,
    },

    appDescription: {
      type: String,
      trim: true,
    },

    about: {
      type: String,
      required: true,
      trim: true,
    },

    address: addressSchema,

    contact: [contactSchema],

    socialMedia: [contactSchema],

    logo: imageSchema,

    favicon: imageSchema,
  },
  {
    timestamps: true,
  },
);

const AppSetting = mongoose.model("AppSetting", appSettingSchema);

export default AppSetting;
