import Cart from "../models/cart.model.js";
import Variant from "../models/variant.model.js";
import AppError from "../utils/AppError.js";
import * as checker from "../utils/errorChecker.js";

const cartPopulate = {
  path: "items.variantId",
  select: "attributes price stock images productId",
  populate: {
    path: "productId",
    select: "name slug brand image isActive",
  },
};

export const getCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate(cartPopulate).lean();

  return cart || { userId, items: [] };
};

export const addToCart = async (userId, variantId, quantity) => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new AppError("Quantity minimal 1", 400);
  }

  const variant = await Variant.findById(variantId)
    .select("_id price stock")
    .lean();

  checker.checkDocument(variant, "Variant not found");

  if (variant.stock < quantity) {
    throw new AppError("Stock not enough", 400);
  }

  const priceAtAdded = variant.price;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    const newCart = await Cart.create({
      userId,
      items: [
        {
          variantId,
          quantity,
          priceAtAdded,
        },
      ],
    });

    return await newCart.populate(cartPopulate);
  }

  const item = cart.items.find((i) => i.variantId.equals(variantId));

  if (item) {
    item.quantity += quantity;
  } else {
    cart.items.push({
      variantId,
      quantity,
      priceAtAdded,
    });
  }

  await cart.save();

  return await cart.populate(cartPopulate);
};

export const changeVariant = async (userId, oldVariantId, newVariantId) => {
  const newVariant = await Variant.findById(newVariantId)
    .select("_id price stock")
    .lean();

  checker.checkDocument(newVariant, "Variant not found");

  const cart = await Cart.findOne({ userId });

  checker.checkDocument(cart, "Cart not found");

  const oldItem = cart.items.find((item) =>
    item.variantId.equals(oldVariantId),
  );

  checker.checkDocument(oldItem, "Cart item not found");

  if (oldItem.quantity > newVariant.stock) {
    throw new AppError("Stock not enough", 400);
  }

  const existingItem = cart.items.find((item) =>
    item.variantId.equals(newVariantId),
  );

  if (existingItem) {
    existingItem.quantity += oldItem.quantity;

    cart.items = cart.items.filter(
      (item) => !item.variantId.equals(oldVariantId),
    );
  } else {
    oldItem.variantId = newVariant._id;
    oldItem.priceAtAdded = newVariant.price;
  }

  await cart.save();

  return await cart.populate(cartPopulate);
};

export const updateCartItemQuantity = async (userId, variantId, quantity) => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new AppError("Quantity minimal 1", 400);
  }

  const cart = await Cart.findOne({ userId });

  checker.checkDocument(cart, "Cart not found");

  const item = cart.items.find((i) => i.variantId.equals(variantId));

  if (!item) {
    throw new AppError("Cart item not found", 404);
  }

  const variant = await Variant.findById(variantId).select("stock").lean();

  if (variant.stock < quantity) {
    throw new AppError("Stock tidak cukup", 400);
  }

  item.quantity = quantity;

  await cart.save();

  return await cart.populate(cartPopulate);
};

export const removeCartItem = async (userId, variantId) => {
  const cart = await Cart.findOne({ userId });

  checker.checkDocument(cart, "Cart not found");

  cart.items = cart.items.filter((i) => !i.variantId.equals(variantId));

  await cart.save();

  return await cart.populate(cartPopulate);
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });

  checker.checkDocument(cart, "Cart not found");

  cart.items = [];

  await cart.save();

  return await cart.populate(cartPopulate);
};
