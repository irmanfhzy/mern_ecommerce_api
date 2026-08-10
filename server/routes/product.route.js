import express from "express";

import normalizeRequestBody from "../middlewares/requestBodyNormalizer.middleware.js";
import validateRequestBody from "../middlewares/requestBodyValidator.middleware.js";
import validateRequestFiles from "../middlewares/requestFilesValidator.middleware.js";
import validateObjectId from "../middlewares/objectIdValidator.middleware.js";
import authenticate from "../middlewares/authenticator.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";
import upload from "../middlewares/multer.middleware.js";

import {
  addProductController,
  deleteProductByIdController,
  getPublicProductsController,
  getAdminProductsController,
  getProductByIdController,
  updateProductController,
  searchProductsController,
} from "../controllers/product.controller.js";

import { ROLE } from "@ecommerce/shared/constants/index.js";

import requestBodySchemas from "../validations/requestBodySchemas.js";
import requestFilesSchemas from "../validations/requestFilesSchemas.js";
import rules from "../validations/normalizerRules.js";

const router = express.Router();

router.get("/", getPublicProductsController);

router.get("/search", searchProductsController);

router.get(
  "/admin",
  authenticate,
  authorize(ROLE.ADMIN),
  getAdminProductsController,
);

router.get("/:id", validateObjectId("params", "id"), getProductByIdController);

router.post(
  "/",
  authenticate,
  authorize(ROLE.ADMIN),
  upload.any(),
  validateRequestFiles(requestFilesSchemas.product.create),
  validateRequestBody(requestBodySchemas.product.create),
  addProductController,
);

router.put(
  "/:id",
  authenticate,
  authorize(ROLE.ADMIN),
  validateObjectId("params", "id"),
  upload.any(),
  validateRequestFiles(requestFilesSchemas.product.update),
  validateRequestBody(requestBodySchemas.product.update),
  updateProductController,
);

router.delete(
  "/:id",
  authenticate,
  authorize(ROLE.ADMIN),
  validateObjectId("params", "id"),
  deleteProductByIdController,
);

export default router;
