import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const addProduct = asyncHandler(async (req, res) => {
  const product = new Product(req.body);
  const savedProduct = await product.save();
  console.log("REQUEST BODY: ", req.body);
  res.status(201).json({ success: true, data: savedProduct });
});

export const findAllProducts = asyncHandler(async (req, res) => {
  console.log("Fetching all products from DB...");
  const allProducts = await Product.find({});
  res.status(200).json({ success: true, data: allProducts });
});

export const findProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("Product is not found", 404);
  }
  res.status(200).json({ success: true, data: product });
});

export const findProductsByName = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const products = await Product.find({
    name: { $regex: name, $options: "i" },
  });
  if (!products || products.length === 0) {
    throw new AppError("Product are not found", 404);
  }
  res.status(200).json({ success: true, data: products });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    returnDocument: "after",
  });

  if (!updatedProduct) {
    throw new AppError("Product is not found", 404);
  }
  res.status(200).json({ success: true, data: updatedProduct });
});

export const deleteProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  if (!deletedProduct) {
    throw new AppError("Product is not found", 404);
  }
  res.status(200).json({ success: true, data: deletedProduct });
});
