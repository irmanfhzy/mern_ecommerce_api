import * as dashboardService from "../services/dashboard.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDasboardController = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboard();
  res.status(200).json({ success: true, data });
});
