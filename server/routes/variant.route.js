import express from "express";

import validateObjectId from "../middlewares/objectIdValidator.middleware.js";
import validateRequestBody from "../middlewares/requestBodyValidator.middleware.js";
import validateRequestFiles from "../middlewares/requestFilesValidator.middleware.js";
import normalizeRequestBody from "../middlewares/requestBodyNormalizer.middleware.js";
import authenticate from "../middlewares/authenticator.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";
import upload from "../middlewares/multer.middleware.js";

import {
  addVariantController,
  getVariantByIdController,
  getVariantsByProductIdController,
  updateVariantByIdController,
  updateVariantStockController,
  deleteVariantByIdController,
} from "../controllers/variant.controller.js";

import { ROLE } from "@ecommerce/shared/constants/index.js";

import requestBodySchemas from "../validations/requestBodySchemas.js";
import requestFilesSchemas from "../validations/requestFilesSchemas.js";
import rules from "../validations/normalizerRules.js";

const router = express.Router();

router.get(
  "/product/:productId",
  validateObjectId("params", "productId"),
  getVariantsByProductIdController,
);

router.get("/:id", validateObjectId("params", "id"), getVariantByIdController);

router.use(authenticate);
router.use(authorize(ROLE.ADMIN));

router.post(
  "/product/:productId",
  validateObjectId("params", "productId"),
  upload.array("variantImages", 10),
  validateRequestFiles(requestFilesSchemas.variant.create),
  validateRequestBody(requestBodySchemas.variant.create),
  normalizeRequestBody(rules.variant.create),
  addVariantController,
);

router.patch(
  "/:id",
  validateObjectId("params", "id"),
  upload.array("variantImages", 10),
  validateRequestFiles(requestFilesSchemas.variant.update),
  validateRequestBody(requestBodySchemas.variant.update),
  normalizeRequestBody(rules.variant.update),
  updateVariantByIdController,
);

router.patch(
  "/:id/stock",
  validateObjectId("params", "id"),
  validateRequestBody(requestBodySchemas.stock.update),
  normalizeRequestBody(rules.stock.update),
  updateVariantStockController,
);

router.delete(
  "/:id",
  validateObjectId("params", "id"),
  deleteVariantByIdController,
);

export default router;
