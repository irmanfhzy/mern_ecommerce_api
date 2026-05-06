import User from "../models/User.js";
import argon2 from "argon2";
import normalizePhone from "../utils/phoneNormalizer.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

export const register = async (body) => {
  const { name, email, password, confirmPassword } = body;
  if (!name || !email || !password || !confirmPassword) {
    throw new AppError("Name, email, and password are required", 400);
  }

  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters long", 400);
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
    throw new AppError(
      "Password must include uppercase, lowercase, number, and no spaces",
      400,
    );
  }

  if (password !== confirmPassword) {
    throw new AppError("Password and password confimation do not match", 400);
  }

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

  if (/^(\+?628|08|8)[0-9]{8,11}$/.test(identifier)) {
    identifier = normalizePhone(identifier);
  }

  if (!identifier || !password) {
    throw new AppError(
      "Email, username, or phone and password are required",
      400,
    );
  }
  const user = await User.findOne({
    $or: [
      { email: identifier },
      { username: identifier },
      { phone: identifier },
    ],
  }).select("+password +refreshToken");
  if (!user) {
    throw new AppError("Email, username, or phone are not found", 404);
  }

  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) {
    throw new AppError("Wrong password", 400);
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
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

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
