import * as cartService from "../services/cart.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCartController = asyncHandler(async (req, res) => {
  const data = await cartService.getCart(req.user.userId);
  res.status(200).json({ success: true, data });
});

export const addToCartController = asyncHandler(async (req, res) => {
  const data = await cartService.addToCart(
    req.user.userId,
    req.params.variantId,
    req.body.quantity,
  );
  res.status(200).json({ success: true, data });
});

export const changeVariantController = asyncHandler(async (req, res) => {
  const data = await cartService.changeVariant(
    req.user.userId,
    req.params.oldVariantId,
    req.body.newVariantId,
  );
  res.status(200).json({ success: true, data });
});

export const updateCartItemQuantityController = asyncHandler(
  async (req, res) => {
    const data = await cartService.updateCartItemQuantity(
      req.user.userId,
      req.params.variantId,
      req.body.quantity,
    );
    res.status(200).json({ success: true, data });
  },
);

export const removeCartItemController = asyncHandler(async (req, res) => {
  const data = await cartService.removeCartItem(
    req.user.userId,
    req.params.variantId,
  );
  res.status(200).json({ success: true, data });
});

export const clearCartController = asyncHandler(async (req, res) => {
  const data = await cartService.clearCart(req.user.userId);
  res.status(200).json({ success: true, data });
});
