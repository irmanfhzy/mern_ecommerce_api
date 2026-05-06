import * as productService from "../services/product.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addProductController = asyncHandler(async (req, res) => {
  const data = await productService.addProduct(req.body);
  res.status(201).json({ success: true, message: "Product Added", data });
});

export const getAdminProductsController = asyncHandler(async (req, res) => {
  const data = await productService.getAdminProducts(req.query);
  res.status(200).json({ success: true, data });
});

export const getPublicProductsController = asyncHandler(async (req, res) => {
  const data = await productService.getPublicProducts(req.query);
  res.status(200).json({ success: true, data });
});

export const getProductByIdController = asyncHandler(async (req, res) => {
  const data = await productService.getProductById(req.params.id);
  res.status(200).json({ success: true, data });
});

export const searchProductsController = asyncHandler(async (req, res) => {
  const data = await productService.searchProduct(req.query.keyword);
  res.status(200).json({ success: true, data });
});

export const updateProductController = asyncHandler(async (req, res) => {
  const data = await productService.updateProductById(req.params.id, req.body);
  res.status(200).json({ success: true, data });
});

export const deleteProductByIdController = asyncHandler(async (req, res) => {
  const data = await productService.deleteProductById(req.params.id);
  res.status(200).json({ success: true, data });
});
