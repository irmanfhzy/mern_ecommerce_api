import express from "express";
import validateObjectId from "../middlewares/objectIdValidator.middleware.js";
import normalizeRequest from "../middlewares/requestNormalizer.middleware.js";
import authenticate from "../middlewares/authenticator.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";
import { variantRules } from "../utils/normalizerRules.js";
import {
  addVariantController,
  getVariantByIdController,
  getVariantsByProductIdController,
  updateVariantByIdController,
  deleteVariantByIdController,
} from "../controllers/variant.controller.js";

const router = express.Router();

router.get("/:id", validateObjectId("params", "id"), getVariantByIdController);

router.get(
  "/product/:productId",
  validateObjectId("params", "productId"),
  getVariantsByProductIdController,
);

router.use(authenticate);
router.use(authorize("admin"));

router.post(
  "/product/:productId",
  validateObjectId("params", "productId"),
  normalizeRequest(variantRules),
  addVariantController,
);

router.patch(
  "/:id",
  validateObjectId("params", "id"),
  normalizeRequest(variantRules),
  updateVariantByIdController,
);

router.delete(
  "/:id",
  validateObjectId("params", "id"),
  deleteVariantByIdController,
);

export default router;
