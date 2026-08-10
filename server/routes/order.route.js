import express from "express";

import {
  createOrderController,
  getAllOrdersController,
  getOrderByIdForAdminController,
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

router.get("/admin", authorize(ROLE.ADMIN), getAllOrdersController);

router.get(
  "/admin/:id",
  authorize(ROLE.ADMIN),
  validateObjectId("params", "id"),
  getOrderByIdForAdminController,
);

router.get("/:id", validateObjectId("params", "id"), getOrderByIdController);

router.patch(
  "/:id/cancel",
  validateObjectId("params", "id"),
  cancelOrderController,
);

router.patch(
  "/:id/status",
  authorize(ROLE.ADMIN),
  validateObjectId("params", "id"),
  updateOrderStatusController,
);

export default router;
