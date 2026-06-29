import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Variant from "../models/variant.model.js";
import { createInventoryHistory } from "./inventoryHistory.service.js";
import AppError from "../utils/AppError.js";
import {
  ORDER_STATUS,
  INVENTORY_TYPE,
  INVENTORY_REASON,
} from "@ecommerce/shared/constants/index.js";

export const createOrder = async ({ userId, items, shippingAddress }) => {
  if (!items || items.length === 0) {
    throw new AppError("Items cannot be empty", 400);
  }

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    let totalPrice = 0;

    const orderItems = [];

    for (const item of items) {
      const variant = await Variant.findOneAndUpdate(
        {
          _id: item.variantId,
          stock: {
            $gte: item.quantity,
          },
        },
        {
          $inc: {
            stock: -item.quantity,
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!variant) {
        throw new AppError("Variant not found or insufficient stock", 400);
      }

      totalPrice += variant.price * item.quantity;

      orderItems.push({
        variantId: variant._id,
        name: variant.name,
        attributes: variant.attributes,
        price: variant.price,
        quantity: item.quantity,
      });
    }

    const order = new Order({
      userId,
      items: orderItems,
      totalPrice,
      payment,
      status: ORDER_STATUS.PENDING,
      shippingAddress,
    });

    await order.save({ session });

    for (const item of orderItems) {
      await createInventoryHistory({
        variantId: item.variantId,
        type: INVENTORY_TYPE.OUT,
        quantity: item.quantity,
        reason: INVENTORY_REASON.ORDER,
        referenceId: order._id,
        session,
      });
    }

    await session.commitTransaction();

    return order;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

export const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({
    _id: orderId,
    userId,
  }).lean();

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
};

export const getUserOrders = async (userId) => {
  return await Order.find({
    userId,
  })
    .sort({
      createdAt: -1,
    })
    .lean();
};

export const updateOrderStatus = async (orderId, status) => {
  const allowedStatus = Object.values(ORDER_STATUS);

  if (!allowedStatus.includes(status)) {
    throw new AppError("Invalid order status", 400);
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  order.status = status;

  await order.save();

  return order;
};

export const cancelOrder = async (orderId, userId) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const order = await Order.findOne({
      _id: orderId,
      userId,
    }).session(session);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.status === ORDER_STATUS.CANCELLED) {
      throw new AppError("Order already cancelled", 400);
    }

    if (order.status !== ORDER_STATUS.PENDING) {
      throw new AppError("Only pending orders can be cancelled", 400);
    }

    for (const item of order.items) {
      await Variant.updateOne(
        {
          _id: item.variantId,
        },
        {
          $inc: {
            stock: item.quantity,
          },
        },
        {
          session,
        },
      );

      await createInventoryHistory({
        variantId: item.variantId,
        type: INVENTORY_TYPE.IN,
        quantity: item.quantity,
        reason: INVENTORY_REASON.CANCELLED,
        referenceId: order._id,
        session,
      });
    }

    order.status = ORDER_STATUS.CANCELLED;

    await order.save({ session });

    await session.commitTransaction();

    return order;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};
