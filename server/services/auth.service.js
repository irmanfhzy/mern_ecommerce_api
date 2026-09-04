import { OAuth2Client } from "google-auth-library";

import User from "../models/user.model.js";
import argon2 from "argon2";
import normalizePhone from "../utils/phoneNormalizer.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import * as checker from "../utils/errorChecker.js";
import AppError from "../utils/AppError.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (body) => {
  const { name, email, password, confirmPassword } = body;
  checker.checkEmail(email);
  checker.checkPassword({
    type: "register",
    type: "register",
    newPassword: password,
    confirmNewPassword: confirmPassword,
  });

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
};

export const login = async (body) => {
  let { identifier, password } = body;

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

  checker.checkDocument(user, "Invalid credentials", 401);

  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
      role: user.role,
      image: user.image,
    },
  };
};

export const googleLogin = async (credential) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const {
    sub: googleId,
    email,
    name,
    picture,
    email_verified: emailVerified,
  } = payload;

  if (!emailVerified) {
    throw new AppError("Google email is not verified", 401);
  }

  let user = await User.findOne({ googleId }).select("+refreshToken");

  if (!user) {
    user = await User.findOne({ email }).select("+refreshToken");

    if (user) {
      user.googleId = googleId;

      if (!user.image?.url && picture) {
        user.image = { url: picture };
      }

      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        image: picture ? { url: picture } : undefined,
        role: "user",
      });
    }
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
      role: user.role,
      image: user.image,
    },
  };
};

export const refreshAccessToken = async (body) => {
  const { refreshToken } = body;

  const decode = verifyRefreshToken(refreshToken);
  const user = await User.findById(decode.userId).select("+refreshToken");
  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  const accessToken = generateAccessToken(user._id, user.role);

  return {
    accessToken,
  };
};

export const getMe = async (userId) => {
  const user = await User.findById(userId)
    .select("_id name email username phone role image")
    .lean();
  checker.checkDocument(user, "User not found", 404);
  return user;
};

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};
