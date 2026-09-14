import e from "express";
import * as authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const registerController = asyncHandler(async (req, res) => {
  await authService.register(req.body);
  res
    .status(201)
    .json({ success: true, message: "Verification code sent to your email" });
});

export const loginController = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  res.status(200).json({ success: true, ...data });
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.body);
  res
    .status(201)
    .json({ success: true, message: "Email verified successfully" });
});

export const resendVerificationEmailController = asyncHandler(
  async (req, res) => {
    await authService.resendVerificationEmail(req.body);
    res.status(200).json({
      success: true,
      message: "Verification code resent to your email",
    });
  },
);

export const googleLoginController = asyncHandler(async (req, res) => {
  const data = await authService.googleLogin(req.body.credential);
  res.status(200).json({ success: true, ...data });
});

export const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const data = await authService.refreshAccessToken(req.body);
  res.status(200).json({ success: true, ...data });
});

export const getMeController = asyncHandler(async (req, res) => {
  const data = await authService.getMe(req.user.userId);
  res.status(200).json({ success: true, data });
});

export const logoutController = asyncHandler(async (req, res) => {
  await authService.logout(req.user.userId);
  res.status(200).json({ success: true, message: "Logged out successfully" });
});
