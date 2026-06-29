import express from "express";

import {
  getInventoryHistoriesByVariantController,
  getInventoryHistoryByIdController,
} from "../controllers/inventoryHistory.controller.js";

import authenticate from "../middlewares/authenticator.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";
import validateObjectId from "../middlewares/objectIdValidator.middleware.js";

import { ROLE } from "@ecommerce/shared/constants/index.js";

const router = express.Router();

router.use(authenticate);
router.use(authorize(ROLE.ADMIN));

router.get(
  "/variant/:variantId",
  validateObjectId("params", "variantId"),
  getInventoryHistoriesByVariantController,
);

router.get(
  "/:id",
  validateObjectId("params", "id"),
  getInventoryHistoryByIdController,
);

export default router;
