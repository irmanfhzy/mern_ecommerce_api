import mongoose from "mongoose";
import normalizePhone from "../utils/phoneNormalizer";

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
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.index({ name: 1, email: 1 });

userSchema.pre("save", function () {
  this.phone = normalizePhone(this.phone);
});

userSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  update.phone = normalizePhone(update.phone);
});

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
