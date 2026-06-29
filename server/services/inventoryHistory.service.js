import InventoryHistory from "../models/inventoryHistory.model.js";
import AppError from "../utils/AppError.js";

export const createInventoryHistory = async ({
  variantId,
  type,
  quantity,
  reason,
  referenceId = null,
  session = null,
}) => {
  const [history] = await InventoryHistory.create(
    [
      {
        variantId,
        type,
        quantity,
        reason,
        referenceId,
      },
    ],
    { session },
  );

  return history;
};

export const getInventoryHistoriesByVariant = async (
  variantId,
  { page = 1, limit = 10 } = {},
) => {
  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const skip = (page - 1) * limit;

  const [histories, total] = await Promise.all([
    InventoryHistory.find({ variantId })
      .populate("variantId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    InventoryHistory.countDocuments({ variantId }),
  ]);

  return {
    histories,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getInventoryHistoryById = async (historyId) => {
  const history =
    await InventoryHistory.findById(historyId).populate("variantId");

  if (!history) {
    throw new AppError("Inventory history not found", 404);
  }

  return history;
};
