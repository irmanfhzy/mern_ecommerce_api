import api from "./api";

export const getCart = () => {
  return api.get("/carts");
};

export const addToCart = (variantId, quantity) => {
  return api.post(`/carts/${variantId}`, { quantity });
};

export const changeVariant = (oldVariantId, newVariantId) => {
  return api.patch(`/carts/${oldVariantId}/variant`, {
    newVariantId,
  });
};

export const updateCartItemQuantity = (variantId, quantity) => {
  return api.patch(`/carts/${variantId}`, { quantity });
};

export const removeCartItem = (variantId) => {
  return api.delete(`/carts/${variantId}`);
};

export const clearCart = () => {
  return api.delete("/carts/clear");
};
