import express from "express";

import authenticate from "../middlewares/authenticator.middleware.js";
import validateObjectId from "../middlewares/objectIdValidator.middleware.js";
import validateRequestBody from "../middlewares/requestBodyValidator.middleware.js";

import {
  getCartController,
  addToCartController,
  changeVariantController,
  updateCartItemQuantityController,
  removeCartItemController,
  clearCartController,
} from "../controllers/cart.controller.js";

import requestBodySchemas from "../validations/requestBodySchemas.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getCartController);

router.post(
  "/:variantId",
  validateObjectId("params", "variantId"),
  validateRequestBody(requestBodySchemas.cart.add),
  addToCartController,
);

router.patch(
  "/:oldVariantId/variant",
  validateObjectId("params", "oldVariantId"),
  validateRequestBody(requestBodySchemas.cart.changeVariant),
  changeVariantController,
);

router.patch(
  "/:variantId",
  validateObjectId("params", "variantId"),
  validateRequestBody(requestBodySchemas.cart.updateQuantity),
  updateCartItemQuantityController,
);

router.delete("/clear", clearCartController);

router.delete(
  "/:variantId",
  validateObjectId("params", "variantId"),
  removeCartItemController,
);

export default router;
