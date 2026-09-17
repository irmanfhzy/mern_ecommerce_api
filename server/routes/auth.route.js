import express from "express";

import authenticate from "../middlewares/authenticator.middleware.js";
import validateRequestBody from "../middlewares/requestBodyValidator.middleware.js";
import normalizeRequestBody from "../middlewares/requestBodyNormalizer.middleware.js";
import createRateLimiter from "../middlewares/rateLimit.middleware.js";

import requestBodySchemas from "../validations/requestBodySchemas.js";
import rules from "../validations/normalizerRules.js";

import {
  registerController,
  verifyEmailController,
  resendVerificationEmailController,
  forgotPasswordController,
  verifyResetPasswordController,
  resendPasswordResetController,
  resetPasswordController,
  loginController,
  googleLoginController,
  refreshAccessTokenController,
  getMeController,
  logoutController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post(
  "/register",
  validateRequestBody(requestBodySchemas.auth.register),
  normalizeRequestBody(rules.auth.register),
  registerController,
);

router.post(
  "/verify-email",
  validateRequestBody(requestBodySchemas.auth.verifyEmail),
  verifyEmailController,
);

router.post(
  "/resend-verification",
  createRateLimiter({
    seconds: 5 * 60,
    limit: 3,
  }),
  validateRequestBody(requestBodySchemas.auth.resendVerification),
  resendVerificationEmailController,
);

router.post(
  "/forgot-password",
  createRateLimiter({
    seconds: 5 * 60,
    limit: 3,
  }),
  validateRequestBody(requestBodySchemas.auth.forgotPassword),
  normalizeRequestBody(rules.auth.forgotPassword),
  forgotPasswordController,
);

router.post(
  "/verify-reset-password",
  validateRequestBody(requestBodySchemas.auth.verifyResetPassword),
  normalizeRequestBody(rules.auth.verifyResetPassword),
  verifyResetPasswordController,
);

router.post(
  "/reset-password",
  validateRequestBody(requestBodySchemas.auth.resetPassword),
  normalizeRequestBody(rules.auth.resetPassword),
  resetPasswordController,
);

router.post(
  "/resend-password-reset",
  createRateLimiter({
    seconds: 5 * 60,
    limit: 3,
  }),
  validateRequestBody(requestBodySchemas.auth.resendPasswordReset),
  normalizeRequestBody(rules.auth.resendPasswordReset),
  resendPasswordResetController,
);

router.post(
  "/login",
  validateRequestBody(requestBodySchemas.auth.login),
  normalizeRequestBody(rules.auth.login),
  loginController,
);

router.post("/google", googleLoginController);

router.post("/refresh-token", refreshAccessTokenController);

router.post("/logout", authenticate, logoutController);

router.get("/me", authenticate, getMeController);

export default router;
