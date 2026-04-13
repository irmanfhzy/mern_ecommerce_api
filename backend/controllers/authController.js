import User from "../models/User.js";
import argon2 from "argon2";
import normalizePhone from "../utils/phoneNormalizer.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required", 400);
  }

  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters long", 400);
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

  res.status(201).json({ success: true, data: user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, username, phone, password } = req.body;

  const normalizedPhone = normalizePhone(phone);

  const identifier = email || username || normalizedPhone;
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
  res.json({
    success: true,
    accessToken,
    refreshToken,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decode.userId).select("+refreshToken");
  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const newAccessToken = generateAccessToken(user._id);
  res.json({ success: true, accessToken: newAccessToken });
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.userId, { refreshToken: null });
  res.json({ success: true, message: "Logged out successfully" });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json({ success: true, data: user });
});
