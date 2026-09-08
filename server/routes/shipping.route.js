import express from "express";
import {
  getShippingRatesController,
  searchAreasController,
} from "../controllers/shipping.controller.js";

import validateRequestBody from "../middlewares/requestBodyValidator.middleware.js";
import authenticate from "../middlewares/authenticator.middleware.js";
import normalizeRequest from "../middlewares/requestBodyNormalizer.middleware.js";

import requestBodySchemas from "../validations/requestBodySchemas.js";

import rules from "../validations/normalizerRules.js";

const router = express.Router();

// router.use(authenticate);

router.get("/areas", searchAreasController);
router.post(
  "/rates",
  validateRequestBody(requestBodySchemas.shipping.rates),
  normalizeRequest(rules.shipping.rates),
  getShippingRatesController,
);

export default router;
