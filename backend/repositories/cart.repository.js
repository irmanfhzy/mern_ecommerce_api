import Cart from "../models/cart.model.js";

export const findCartByUser = (userId) => {
  return Cart.findOne({ userId }).populate("items.variantId");
};

export const incrementItem = (userId, variantId, quantity) => {
  return Cart.findOneAndUpdate(
    {
      userId,
      "items.variantId": variantId,
    },
    {
      $inc: { "items.$.quantity": quantity },
    },
    {
      runValidators: true,
      returnDocument: "after",
    },
  );
};
