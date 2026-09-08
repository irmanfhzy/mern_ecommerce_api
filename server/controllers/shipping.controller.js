import asyncHandler from "../utils/asyncHandler.js";
import * as shippingService from "../services/shipping.service.js";

export const getShippingRatesController = asyncHandler(async (req, res) => {
  const data = await shippingService.getShippingRates(req.body);
  res.status(200).json({ success: true, data });
});

export const searchAreasController = asyncHandler(async (req, res) => {
  const data = await shippingService.searchAreas(req.query.input);
  res.status(200).json({ success: true, data });
});
