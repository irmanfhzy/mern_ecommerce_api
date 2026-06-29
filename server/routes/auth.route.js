import express from "express";

import authenticate from "../middlewares/authenticator.middleware.js";
import validateRequestBody from "../middlewares/requestBodyValidator.middleware.js";
import normalizeRequestBody from "../middlewares/requestBodyNormalizer.middleware.js";

import requestBodySchemas from "../validations/requestBodySchemas.js";
import rules from "../validations/normalizerRules.js";

import {
  registerController,
  loginController,
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
  "/login",
  validateRequestBody(requestBodySchemas.auth.login),
  normalizeRequestBody(rules.auth.login),
  loginController,
);

router.post("/refresh-token", refreshAccessTokenController);

router.post("/logout", authenticate, logoutController);

router.get("/me", authenticate, getMeController);

export default router;
