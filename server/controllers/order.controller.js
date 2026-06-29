import asyncHandler from "../utils/asyncHandler.js";
import * as orderService from "../services/order.service.js";

export const createOrderController = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  const data = await orderService.createOrder({
    userId: req.user.userId,
    items,
    shippingAddress,
  });

  res.status(201).json({
    success: true,
    data,
  });
});

export const getOrderByIdController = asyncHandler(async (req, res) => {
  const data = await orderService.getOrderById(req.params.id, req.user.userId);

  res.status(200).json({
    success: true,
    data,
  });
});

export const getUserOrdersController = asyncHandler(async (req, res) => {
  const data = await orderService.getUserOrders(req.user.userId);

  res.status(200).json({
    success: true,
    data,
  });
});

export const updateOrderStatusController = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const data = await orderService.updateOrderStatus(req.params.id, status);

  res.status(200).json({
    success: true,
    data,
  });
});

export const cancelOrderController = asyncHandler(async (req, res) => {
  const data = await orderService.cancelOrder(req.params.id, req.user.userId);

  res.status(200).json({
    success: true,
    data,
  });
});
