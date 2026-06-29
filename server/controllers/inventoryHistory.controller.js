import * as inventoryHistory from "../services/inventoryHistory.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getInventoryHistoriesByVariantController = asyncHandler(
  async (req, res) => {
    const data = await inventoryHistory.getInventoryHistoriesByVariant(
      req.params.variantId,
      req.query,
    );

    res.status(200).json({
      success: true,
      ...data,
    });
  },
);

export const getInventoryHistoryByIdController = asyncHandler(
  async (req, res) => {
    const history = await inventoryHistory.getInventoryHistoryById(
      req.params.historyId,
    );

    res.status(200).json({
      success: true,
      data: history,
    });
  },
);
