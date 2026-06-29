import api from "./api";

export const getInventoryHistoriesByVariant = (variantId, params = {}) => {
  return api.get(`/inventory-histories/variant/${variantId}`, {
    params,
  });
};

export const getInventoryHistoryById = (historyId) => {
  return api.get(`/inventory-histories/${historyId}`);
};
