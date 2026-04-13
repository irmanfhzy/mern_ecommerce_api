import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    attributes: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

variantSchema.index({
  productId: 1,
  "attributes.key": 1,
  "attributes.value": 1,
});

const Variant = mongoose.model("Variant", variantSchema);

export default Variant;
