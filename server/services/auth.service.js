import argon2 from "argon2";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import User from "../models/user.model.js";
import PasswordReset from "../models/passwordReset.model.js";
import EmailVerification from "../models/emailVerification.model.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "./email.service.js";
import normalizePhone from "../utils/phoneNormalizer.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetPasswordToken,
  verifyRefreshToken,
  verifyToken,
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

  const verification = await EmailVerification.findOne({ email });

  const cooldown = 60 * 1000;

  if (verification) {
    const elapsed = Date.now() - verification.updatedAt.getTime();

    if (elapsed < cooldown) {
      const remainingTime = Math.ceil((cooldown - elapsed) / 1000);

      throw new AppError(
        `Please wait ${remainingTime} seconds before requesting another verification code`,
        429,
      );
    }
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

  return {
    cooldown,
  };
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

  const cooldown = 60 * 1000;
  const elapsed = Date.now() - verification.updatedAt.getTime();

  if (elapsed < cooldown) {
    const remainingTime = Math.ceil((cooldown - elapsed) / 1000);

    throw new AppError(
      `Please wait ${remainingTime} seconds before requesting another verification code`,
      429,
    );
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  const otpHash = await argon2.hash(otp);

  verification.otpHash = otpHash;
  verification.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await verification.save();
  await sendVerificationEmail(email, otp);

  return {
    cooldown,
  };
};

export const forgotPassword = async (body) => {
  const { email } = body;

  checker.checkEmail(email);

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Email not found", 404);
  }

  const passwordReset = await PasswordReset.findOne({ email });

  const cooldown = 60 * 1000;

  if (passwordReset) {
    const elapsed = Date.now() - passwordReset.updatedAt.getTime();

    if (elapsed < cooldown) {
      const remainingTime = Math.ceil((cooldown - elapsed) / 1000);

      throw new AppError(
        `Please wait ${remainingTime} seconds before requesting another password reset code`,
        429,
      );
    }
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  const otpHash = await argon2.hash(otp);

  await PasswordReset.findOneAndUpdate(
    { email },
    {
      email,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    {
      upsert: true,
    },
  );

  await sendPasswordResetEmail(email, otp);

  return {
    cooldown,
  };
};

export const verifyResetPassword = async (body) => {
  const { email, otp } = body;

  const passwordReset = await PasswordReset.findOne({ email });

  if (!passwordReset) {
    throw new AppError("Password reset code not found or expired", 400);
  }

  if (passwordReset.expiresAt <= new Date()) {
    await PasswordReset.deleteOne({ email });

    throw new AppError("Password reset code expired", 400);
  }

  const isValid = await argon2.verify(passwordReset.otpHash, otp);

  if (!isValid) {
    throw new AppError("Invalid password reset code", 400);
  }

  const resetPasswordToken = generateResetPasswordToken(
    email,
    "reset-password",
  );

  return {
    resetPasswordToken,
  };
};

export const resetPassword = async (body) => {
  const { token, newPassword, confirmNewPassword } = body;

  checker.checkPassword({
    type: "update",
    newPassword,
    confirmNewPassword,
  });

  const tokenPayload = verifyToken(token);

  if (tokenPayload.purpose !== "reset-password") {
    throw new AppError("Invalid token", 400);
  }

  const passwordReset = await PasswordReset.findOne({
    email: tokenPayload.email,
  });

  if (!passwordReset) {
    throw new AppError("Password reset code not found or expired", 400);
  }

  if (passwordReset.expiresAt <= new Date()) {
    await PasswordReset.deleteOne({ email: tokenPayload.email });
    throw new AppError("Password reset code expired", 400);
  }

  const hashedPassword = await argon2.hash(newPassword);

  await User.findOneAndUpdate(
    { email: tokenPayload.email },
    { password: hashedPassword },
  );

  await PasswordReset.deleteOne({ email: tokenPayload.email });
};

export const resendPasswordReset = async (body) => {
  const { email } = body;

  checker.checkEmail(email);

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Email not found", 404);
  }

  const passwordReset = await PasswordReset.findOne({ email });

  if (!passwordReset) {
    throw new AppError("Password reset request not found or expired", 400);
  }

  const cooldown = 60 * 1000;
  const elapsed = Date.now() - passwordReset.updatedAt.getTime();

  if (elapsed < cooldown) {
    const remainingTime = Math.ceil((cooldown - elapsed) / 1000);

    throw new AppError(
      `Please wait ${remainingTime} seconds before requesting another password reset code`,
      429,
    );
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  const otpHash = await argon2.hash(otp);

  passwordReset.otpHash = otpHash;
  passwordReset.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await passwordReset.save();
  await sendPasswordResetEmail(email, otp);

  return {
    cooldown,
  };
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
