import axios from "axios";

import AppError from "../utils/AppError.js";
import * as checker from "../utils/errorChecker.js";

import * as cartService from "./cart.service.js";
import Variant from "../models/variant.model.js";

const biteship = axios.create({
  baseURL: "https://api.biteship.com",
  headers: {
    Authorization: `Bearer ${process.env.BITESHIP_API_KEY}`,
    "Content-Type": "application/json",
  },
});

const calculateShippingItems = async (cart, selectedItems) => {
  const shippingItems = [];

  for (const selectedItem of selectedItems) {
    if (!selectedItem.variantId || !selectedItem.quantity) {
      throw new AppError("Invalid shipping item", 400);
    }

    let variant = null;

    const cartItem = cart?.items?.find(
      (item) =>
        item.variantId._id.toString() === selectedItem.variantId.toString(),
    );

    if (cartItem) {
      if (selectedItem.quantity > cartItem.quantity) {
        throw new AppError(
          `Quantity for variant ${selectedItem.variantId} exceeds cart quantity`,
          400,
        );
      }

      variant = cartItem.variantId;
    } else {
      variant = await Variant.findById(selectedItem.variantId).populate(
        "productId",
      );
    }

    checker.checkDocument(
      variant,
      `Variant ${selectedItem.variantId} not found`,
      404,
    );

    checker.checkDocument(
      variant.productId,
      `Product for variant ${selectedItem.variantId} not found`,
      404,
    );

    shippingItems.push({
      name: variant.productId.name,
      weight: variant.weight,
      quantity: selectedItem.quantity,
      value: variant.sellingPrice,
    });
  }

  return shippingItems;
};

export const getShippingRates = async (userId, body) => {
  const {
    items: selectedItems,
    originPostalCode,
    destinationPostalCode,
    couriers,
  } = body;

  if (!selectedItems?.length) {
    throw new AppError("At least one item is required", 400);
  }

  const originPC = Number(originPostalCode);
  const destinationPC = Number(destinationPostalCode);

  if (!Number.isFinite(originPC) || !Number.isFinite(destinationPC)) {
    throw new AppError("Postal codes must be valid numbers", 400);
  }

  if (!couriers) {
    throw new AppError("Couriers is required", 400);
  }

  const cart = await cartService.getCart(userId);

  const shippingItems = await calculateShippingItems(cart, selectedItems);

  try {
    const response = await biteship.post("/v1/rates/couriers", {
      origin_postal_code: originPC,
      destination_postal_code: destinationPC,
      couriers,
      items: shippingItems,
    });

    return response.data;
  } catch (error) {
    const status = error.response?.status ?? 502;

    const data = error.response?.data;

    throw new AppError(
      data?.error || data?.message || "Biteship rates request failed",
      status,
    );
  }
};

export const searchAreas = async (query) => {
  const input = query.input;
  try {
    const response = await biteship.get("/v1/maps/areas", {
      params: {
        input,
      },
    });

    return response.data;
  } catch (error) {
    const status = error.response?.status ?? 502;

    const data = error.response?.data;

    throw new AppError(
      data?.error || data?.message || "Biteship area search failed",
      status,
    );
  }
};
