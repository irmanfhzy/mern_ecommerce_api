import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },

    image: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true },
);

productSchema.index({ name: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
