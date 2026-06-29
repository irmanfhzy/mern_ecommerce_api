import api from "./api";

export const getVariantsByProductId = (productId, params = {}) => {
  return api.get(`/variants/product/${productId}`, { params });
};

export const getVariantById = (id) => {
  return api.get(`/variants/${id}`);
};

export const addVariant = (productId, formData) => {
  return api.post(`/variants/product/${productId}`, formData);
};

export const updateVariantById = (id, formData) => {
  return api.patch(`/variants/${id}`, formData);
};

export const updateVariantStock = (id, data) => {
  return api.patch(`/variants/${id}/stock`, data);
};

export const deleteVariantById = (id) => {
  return api.delete(`/variants/${id}`);
};
