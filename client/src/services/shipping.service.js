import api from "./api";

export const getShippingRates = (data) => {
  return api.post("/shipping/rates", data);
};
