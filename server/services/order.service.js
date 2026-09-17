import mongoose from "mongoose";

import Order from "../models/order.model.js";
import Variant from "../models/variant.model.js";
import Cart from "../models/cart.model.js";
import AppSetting from "../models/appSetting.model.js";
import InventoryHistory from "../models/inventoryHistory.model.js";

import { createInventoryHistory } from "./inventoryHistory.service.js";
import { createPayment } from "./payment.service.js";
import * as shippingService from "./shipping.service.js";

import generateOrderNumber from "../utils/orderNumberGenerator.js";
import AppError from "../utils/AppError.js";
import * as checker from "../utils/errorChecker.js";

import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  INVENTORY_TYPE,
  INVENTORY_REASON,
} from "@ecommerce/shared/constants/index.js";

export const createOrder = async (userId, body) => {
  const { items, totalPrice, shippingAddress, shipping } = body;

  if (!items || items.length === 0) {
    throw new AppError("Items cannot be empty", 400);
  }

  if (!shipping) {
    throw new AppError("Shipping information is required", 400);
  }

  if (!shipping.courierCode) {
    throw new AppError("Shipping courier is required", 400);
  }

  if (!shipping.serviceCode) {
    throw new AppError("Shipping service is required", 400);
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { orderId, orderNumber } = generateOrderNumber();

    let calculatedSubtotal = 0;

    const orderItems = [];

    const appSetting = await AppSetting.findOne().select("address").lean();

    checker.checkDocument(appSetting, "App setting not found", 404);

    const originPostalCode = Number(appSetting.address?.postalCode);

    const destinationPostalCode = Number(shippingAddress?.postalCode);

    if (
      !Number.isFinite(originPostalCode) ||
      !Number.isFinite(destinationPostalCode)
    ) {
      throw new AppError("Invalid origin or destination postal code", 400);
    }

    for (const item of items) {
      if (!item.variantId || !item.quantity) {
        throw new AppError("Invalid order item", 400);
      }

      const variant = await Variant.findOneAndUpdate(
        {
          _id: item.variantId,
          stock: { $gte: item.quantity },
        },
        {
          $inc: {
            stock: -item.quantity,
          },
        },
        {
          returnDocument: "after",
          session,
        },
      ).populate("productId");

      checker.checkDocument(
        variant,
        "Variant not found or insufficient stock",
        400,
      );

      calculatedSubtotal += variant.sellingPrice * item.quantity;

      orderItems.push({
        productId: variant.productId._id,
        variantId: variant._id,

        productName: variant.productId.name,
        productBrand: variant.productId.brand,
        productSlug: variant.productId.slug,
        productImages: variant.productId.images,

        variantAttributes: variant.attributes,
        variantSku: variant.sku,
        variantImages: variant.images,

        sellingPrice: variant.sellingPrice,
        quantity: item.quantity,
      });
    }

    const rates = await shippingService.getShippingRates(userId, {
      items,
      originPostalCode,
      destinationPostalCode,
      couriers: shipping.courierCode,
    });

    const shippingRate = rates?.pricing?.find(
      (rate) =>
        rate.courier_code === shipping.courierCode &&
        rate.courier_service_code === shipping.serviceCode,
    );

    if (!shippingRate) {
      throw new AppError(
        "Selected shipping service is no longer available",
        400,
      );
    }

    const shippingPrice = Number(shippingRate.price);

    if (!Number.isFinite(shippingPrice) || shippingPrice < 0) {
      throw new AppError("Invalid shipping price", 400);
    }

    const calculatedTotalPrice = calculatedSubtotal + shippingPrice;

    if (totalPrice !== calculatedTotalPrice) {
      throw new AppError(
        "Order total has changed. Please review your cart.",
        400,
      );
    }

    const shippingData = {
      courierCode: shippingRate.courier_code,
      courierName: shippingRate.courier_name,
      serviceCode: shippingRate.courier_service_code,
      serviceName: shippingRate.courier_service_name,
      price: shippingPrice,
      etd: shippingRate.duration,
    };

    const order = new Order({
      _id: orderId,
      orderNumber,
      userId,

      items: orderItems,

      totalPrice: calculatedTotalPrice,

      paymentStatus: PAYMENT_STATUS.PENDING,
      orderStatus: ORDER_STATUS.PENDING,

      shippingAddress,
      shipping: shippingData,
    });

    await order.save({
      session,
    });

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

    const cart = await Cart.findOne({
      userId,
    }).session(session);

    if (cart) {
      for (const orderItem of order.items) {
        const cartItem = cart.items.find(
          (item) =>
            item.variantId.toString() === orderItem.variantId.toString(),
        );

        if (!cartItem) {
          continue;
        }

        cartItem.quantity -= orderItem.quantity;
      }

      cart.items = cart.items.filter((item) => item.quantity > 0);

      await cart.save({
        session,
      });
    }

    await session.commitTransaction();

    const payment = await createPayment({
      orderId: order._id,
      totalPrice: order.totalPrice,
      items: order.items,
      shippingPrice,
    });

    return {
      order,
      snapToken: payment.token,
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

export const getAllOrders = async (query) => {
  const { search = "", status, page = 1, limit = 10 } = query;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      {
        orderNumber: {
          $regex: search,
          $options: "i",
        },
      },
      {
        "shippingAddress.recipientName": {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, totalItems] = await Promise.all([
    Order.find(filter)
      .populate({
        path: "userId",
        select: "name email",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Order.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

export const getOrderByIdForAdmin = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("userId", "name email phone")
    .lean();

  checker.checkDocument(order, "Order not found", 404);

  return order;
};

export const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({
    _id: orderId,
    userId,
  }).lean();

  checker.checkDocument(order, "Order not found", 404);

  return order;
};

export const getUserOrders = async (userId) => {
  const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();

  return orders;
};

export const updateOrderStatus = async (orderId, status) => {
  if (!Object.values(ORDER_STATUS).includes(status)) {
    throw new AppError("Invalid order status", 400);
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (
    order.paymentStatus !== PAYMENT_STATUS.PAID &&
    status !== ORDER_STATUS.CANCELLED
  ) {
    throw new AppError(
      "Order cannot be processed before payment is completed",
      400,
    );
  }

  const allowedTransitions = {
    [ORDER_STATUS.PENDING]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED],
    [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED],
    [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.COMPLETED],
    [ORDER_STATUS.COMPLETED]: [],
    [ORDER_STATUS.CANCELLED]: [],
  };

  if (!allowedTransitions[order.orderStatus].includes(status)) {
    throw new AppError("Invalid order status transition", 400);
  }

  order.orderStatus = status;

  switch (status) {
    case ORDER_STATUS.COMPLETED:
      order.completedAt = new Date();
      break;

    case ORDER_STATUS.CANCELLED:
      order.cancelledAt = new Date();
      break;
  }

  await order.save();

  return order;
};

export const updatePaymentStatus = async (orderId, paymentStatus) => {
  if (!Object.values(PAYMENT_STATUS).includes(paymentStatus)) {
    throw new AppError("Invalid payment status", 400);
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.paymentStatus === PAYMENT_STATUS.REFUNDED) {
    throw new AppError("Refunded payment cannot be updated", 400);
  }

  if (
    order.orderStatus === ORDER_STATUS.COMPLETED ||
    order.orderStatus === ORDER_STATUS.CANCELLED
  ) {
    throw new AppError(
      "Payment status cannot be updated for completed or cancelled orders",
      400,
    );
  }

  order.paymentStatus = paymentStatus;

  switch (paymentStatus) {
    case PAYMENT_STATUS.PAID:
      order.paidAt = new Date();
      break;

    case PAYMENT_STATUS.FAILED:
      order.paidAt = null;
      break;

    case PAYMENT_STATUS.REFUNDED:
      order.paidAt = null;
      break;
  }

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

    if (order.orderStatus !== ORDER_STATUS.PENDING) {
      throw new AppError("Only pending orders can be cancelled", 400);
    }

    if (order.paymentStatus !== PAYMENT_STATUS.PENDING) {
      throw new AppError("Order cannot be cancelled", 400);
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

    order.orderStatus = ORDER_STATUS.CANCELLED;
    order.paymentStatus = PAYMENT_STATUS.CANCELLED;
    order.cancelledAt = new Date();

    await order.save({ session });

    await session.commitTransaction();

    return order;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

export const discardCancelledOrderPayment = async (orderId, userId) => {
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

    if (
      order.orderStatus !== ORDER_STATUS.PENDING ||
      order.paymentStatus !== PAYMENT_STATUS.PENDING ||
      order.paymentTransactionId
    ) {
      throw new AppError("Order cannot be discarded", 400);
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

      await InventoryHistory.deleteOne(
        {
          variantId: item.variantId,
          type: INVENTORY_TYPE.OUT,
          reason: INVENTORY_REASON.ORDER,
          referenceId: order._id,
        },
        {
          session,
        },
      );
    }

    const discardedOrder = {
      _id: order._id,
      orderNumber: order.orderNumber,
    };

    const cart = await Cart.findOne({ userId }).session(session);

    if (cart) {
      for (const orderItem of order.items) {
        const cartItem = cart.items.find(
          (item) =>
            item.variantId.toString() === orderItem.variantId.toString(),
        );

        if (cartItem) {
          cartItem.quantity += orderItem.quantity;
        } else {
          cart.items.push({
            variantId: orderItem.variantId,
            quantity: orderItem.quantity,
            priceAtAdded: orderItem.sellingPrice,
          });
        }
      }

      await cart.save({ session });
    }

    await Order.deleteOne(
      {
        _id: order._id,
      },
      {
        session,
      },
    );

    await session.commitTransaction();

    return discardedOrder;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

export const getOrderStatistics = async () => {
  const [total, pending, revenue] = await Promise.all([
    Order.countDocuments(),

    Order.countDocuments({
      orderStatus: ORDER_STATUS.PENDING,
    }),

    Order.aggregate([
      {
        $match: {
          orderStatus: ORDER_STATUS.COMPLETED,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]),
  ]);

  return {
    total,
    pending,
    revenue: revenue[0]?.totalRevenue ?? 0,
  };
};
