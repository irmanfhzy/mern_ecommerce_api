import crypto from "crypto";

import snap from "../config/midtrans.js";
import Order from "../models/order.model.js";

import { PAYMENT_STATUS } from "@ecommerce/shared/constants/index.js";

import * as checker from "../utils/errorChecker.js";
import AppError from "../utils/AppError.js";

const verifySignature = ({
  order_id,
  status_code,
  gross_amount,
  signature_key,
}) => {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  const signature = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + serverKey)
    .digest("hex");

  return signature === signature_key;
};

export const createPayment = async ({ orderId, totalPrice, items }) => {
  const parameter = {
    transaction_details: {
      order_id: orderId.toString(),
      gross_amount: totalPrice,
    },

    item_details: items.map((item) => ({
      id: item.variantId.toString(),
      price: item.sellingPrice,
      quantity: item.quantity,
      name: item.productName,
    })),
  };

  const transaction = await snap.createTransaction(parameter);

  return transaction;
};

export const handlePaymentNotification = async (notification) => {
  const {
    order_id,
    transaction_id,
    transaction_status,
    payment_type,
    status_code,
    gross_amount,
    signature_key,
  } = notification;

  const isValidSignature = verifySignature({
    order_id,
    status_code,
    gross_amount,
    signature_key,
  });

  if (!isValidSignature) {
    throw new AppError("Invalid Midtrans signature", 401);
  }

  const order = await Order.findById(order_id);

  checker.checkDocument(order, "Order not found", 404);

  if (Number(gross_amount) !== order.totalPrice) {
    throw new AppError("Payment amount does not match order total", 400);
  }

  order.paymentTransactionId = transaction_id;
  order.paymentMethod = payment_type;

  switch (transaction_status) {
    case "settlement":
    case "capture":
      order.paymentStatus = PAYMENT_STATUS.PAID;
      order.paidAt = new Date();
      break;

    case "pending":
      order.paymentStatus = PAYMENT_STATUS.PENDING;
      break;

    case "deny":
    case "cancel":
    case "expire":
    case "failure":
      order.paymentStatus = PAYMENT_STATUS.FAILED;
      order.paidAt = null;
      break;
  }

  await order.save();

  return order;
};
