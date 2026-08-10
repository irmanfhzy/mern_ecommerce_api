import api from "./api";

export const createOrder = (data) => {
  return api.post("/orders", data);
};

export const getAllOrders = (params = {}) => {
  return api.get("/orders/admin", { params });
};

export const getOrderByIdForAdmin = (orderId) => {
  return api.get(`/orders/admin/${orderId}`);
};

export const getOrderById = (orderId) => {
  return api.get(`/orders/${orderId}`);
};

export const getUserOrders = (params = {}) => {
  return api.get("/orders/my-orders", { params });
};

export const updateOrderStatus = (orderId, data) => {
  return api.patch(`/orders/${orderId}/status`, data);
};

export const cancelOrder = (orderId) => {
  return api.patch(`/orders/${orderId}/cancel`);
};
