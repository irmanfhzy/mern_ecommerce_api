import mongoose from "mongoose";
import User from "../models/User.js";
import argon2 from "argon2";
import normalizePhone from "../utils/phoneNormalizer.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import * as checker from "../utils/errorChecker.js";
import { AppError } from "../utils/AppError.js";

export const register = async (body) => {
  const { name, email, password, confirmPassword } = body;
  checker.checkInputs({ name, email, password, confirmPassword });
  checker.checkPassword({ type: "register", password, confirmPassword });

  const session = await mongoose.startSession();
  try {
  } catch (error) {}

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await argon2.hash(password);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "user",
  });

  return user;
};

export const login = async (body) => {
  let { identifier, password } = body;

  checker.checkInputs({ identifier, password });

  if (/^(\+?628|08|8)[0-9]{8,11}$/.test(identifier)) {
    identifier = normalizePhone(identifier);
  }

  const user = await User.findOne({
    $or: [
      { email: identifier },
      { username: identifier },
      { phone: identifier },
    ],
  }).select("+password +refreshToken");

  checker.checkDoc(user, "Invalid credentials", 401);

  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const refreshAccessToken = async (body) => {
  const { refreshToken } = body;
  checker.checkInputs({ refreshToken });

  const decode = verifyRefreshToken(refreshToken);
  const user = await User.findById(decode.userId).select("+refreshToken");
  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const newAccessToken = generateAccessToken(user._id);

  return newAccessToken;
};

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};
