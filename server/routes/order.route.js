import express from "express";

import {
  createOrderController,
  getOrderByIdController,
  getUserOrdersController,
  updateOrderStatusController,
  cancelOrderController,
} from "../controllers/order.controller.js";

import authenticate from "../middlewares/authenticator.middleware.js";
import authorize from "../middlewares/authorization.middleware.js";
import validateObjectId from "../middlewares/objectIdValidator.middleware.js";

import { ROLE } from "@ecommerce/shared/constants/index.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createOrderController);

router.get("/my-orders", getUserOrdersController);

router.patch(
  "/:id/cancel",
  validateObjectId("params", "id"),
  cancelOrderController,
);

router.patch(
  "/:id/status",
  validateObjectId("params", "id"),
  authorize(ROLE.ADMIN),
  updateOrderStatusController,
);

router.get("/:id", validateObjectId("params", "id"), getOrderByIdController);

export default router;
