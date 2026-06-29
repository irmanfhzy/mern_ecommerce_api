import mongoose from "mongoose";
import {
  INVENTORY_TYPE,
  INVENTORY_REASON,
} from "@ecommerce/shared/constants/index.js";

const inventoryHistorySchema = new mongoose.Schema(
  {
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(INVENTORY_TYPE),
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      enum: Object.values(INVENTORY_REASON),
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true },
);

const InventoryHistory = mongoose.model(
  "InventoryHistory",
  inventoryHistorySchema,
);

export default InventoryHistory;
