import mongoose from "mongoose";

const inventoryHistorySchema = new mongoose.Schema(
  {
    variantId: {
      type: mongoose.Schema.types.ObjectId,
      ref: "Variant",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["in", "out"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      enum: ["restock", "order", "manual"],
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
  "InventoryHostory",
  inventoryHistorySchema,
);

export default InventoryHistory;
