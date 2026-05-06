import express from "express";
import authenticate from "../middlewares/authenticator.middleware.js";
import normalizeRequest from "../middlewares/normalizer.middleware.js";
import { registerRules, loginRules } from "../utils/normalizerRules.js";
import {
  registerController,
  loginController,
  refreshAccessTokenController,
  logoutController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", normalizeRequest(registerRules), registerController);
router.post("/login", normalizeRequest(loginRules), loginController);
router.post("/refresh", refreshAccessTokenController);
router.post("/logout", authenticate, logoutController);

export default router;
