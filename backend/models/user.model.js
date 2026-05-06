import mongoose from "mongoose";
import normalizePhone from "../utils/phoneNormalizer.js";

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    default: "",
  },
  recipientName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  village: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      lowercase: true,
    },
    dateOfBirth: {
      type: Date,
    },
    image: {
      type: String,
      default: "/assets/default-avatar.png",
    },
    phone: {
      type: String,
      match: /^(08|\+628)[0-9]{8,11}$/,
      trim: true,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      match: /^[a-zA-Z0-9_.%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9]{2,})+$/,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      lowercase: true,
      match: /^[a-z0-9_.-]+$/,
      unique: true,
      trim: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.index({ name: "text" });

userSchema.pre("save", function () {
  if (this.phone) {
    this.phone = normalizePhone(this.phone);
  }
});

userSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (update.phone) {
    update.phone = normalizePhone(update.phone);
  }
});

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
