import api from "./api";

export const addProduct = async (data) => {
  return await api.post("/products", data);
};

export const getAdminProducts = async (params) => {
  return await api.get("/products/admin", { params });
};

export const getPublicProducts = async (params) => {
  return await api.get("/products", { params });
};

export const getProductById = async (id) => {
  return await api.get(`/products/${id}`);
};

export const searchProducts = async (params) => {
  return await api.get("/products/search", { params });
};

export const updateProductById = async (id, data) => {
  return await api.put(`/products/${id}`, data);
};

export const deleteProductById = async (id) => {
  return await api.delete(`/products/${id}`);
};
