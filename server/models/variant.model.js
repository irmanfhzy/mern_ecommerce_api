import mongoose from "mongoose";
import imageSchema from "./image.model.js";

const attributeSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  { _id: false },
);

const variantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    attributes: {
      type: [attributeSchema],
      default: [],
      validate: {
        validator: function (attrs) {
          const keys = attrs.map((attr) => attr.key);
          return new Set(keys).size === keys.length;
        },
        message: "Duplicate attribute keys are not allowed",
      },
    },
    attributesKey: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
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
    images: {
      type: [imageSchema],
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

variantSchema.pre("validate", function () {
  if (!this.attributes || this.attributes.length === 0) {
    this.attributesKey = "";
    return;
  }

  const sorted = [...this.attributes].sort((a, b) =>
    a.key.localeCompare(b.key),
  );

  this.attributesKey = sorted
    .map((attr) => `${attr.key}:${attr.value}`)
    .join("|");
});

variantSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (update.attributes) {
    const sorted = [...update.attributes].sort((a, b) =>
      a.key.localeCompare(b.key),
    );

    update.attributesKey = sorted
      .map((attr) => `${attr.key}:${attr.value}`)
      .join("|");
  }
});

variantSchema.index({ productId: 1, attributesKey: 1 }, { unique: true });

const Variant = mongoose.model("Variant", variantSchema);

export default Variant;
