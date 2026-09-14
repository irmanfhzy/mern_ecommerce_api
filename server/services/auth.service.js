import argon2 from "argon2";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import User from "../models/user.model.js";
import EmailVerification from "../models/emailVerification.model.js";
import { sendVerificationEmail } from "./email.service.js";
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
    newPassword: password,
    confirmNewPassword: confirmPassword,
  });

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await argon2.hash(password);

  const otp = crypto.randomInt(100000, 1000000).toString();
  const otpHash = await argon2.hash(otp);

  await EmailVerification.findOneAndUpdate(
    { email },
    {
      name,
      email,
      password: hashedPassword,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    {
      upsert: true,
    },
  );

  await sendVerificationEmail(email, otp);
};

export const verifyEmail = async (body) => {
  const { email, otp } = body;

  const verification = await EmailVerification.findOne({ email });

  if (!verification) {
    throw new AppError("Verification code not found or expired", 400);
  }

  if (verification.expiresAt <= new Date()) {
    await EmailVerification.deleteOne({ email });

    throw new AppError("Verification code expired", 400);
  }

  const isValid = await argon2.verify(verification.otpHash, otp);

  if (!isValid) {
    throw new AppError("Invalid verification code", 400);
  }

  const user = await User.create({
    name: verification.name,
    email: verification.email,
    password: verification.password,
    role: "user",
  });

  await EmailVerification.deleteOne({ email });

  return user;
};

export const resendVerificationEmail = async (body) => {
  const { email } = body;

  checker.checkEmail(email);

  const verification = await EmailVerification.findOne({ email });

  if (!verification) {
    throw new AppError("Verification request not found or expired", 400);
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  const otpHash = await argon2.hash(otp);

  verification.otpHash = otpHash;
  verification.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await verification.save();

  await sendVerificationEmail(email, otp);
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
