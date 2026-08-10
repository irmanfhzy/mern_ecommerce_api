import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    default: "",
    trim: true,
  },

  recipientName: {
    type: String,
    trim: true,
  },

  phone: {
    type: String,
    trim: true,
  },

  street: {
    type: String,
    required: true,
    trim: true,
  },

  villageId: {
    type: String,
    required: true,
  },

  village: {
    type: String,
    required: true,
    trim: true,
  },

  districtId: {
    type: String,
    required: true,
  },

  district: {
    type: String,
    required: true,
    trim: true,
  },

  cityId: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
    trim: true,
  },

  provinceId: {
    type: String,
    required: true,
  },

  province: {
    type: String,
    required: true,
    trim: true,
  },

  postalCode: {
    type: String,
    required: true,
    trim: true,
  },

  isDefault: {
    type: Boolean,
    default: false,
  },
});

export default addressSchema;
