import * as variantService from "../services/variant.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addVariantController = asyncHandler(async (req, res) => {
  const data = await variantService.addVariant(
    req.params.productId,
    req.body,
    req.files,
  );
  res.status(201).json({ success: true, data });
});

export const getVariantsByProductIdController = asyncHandler(
  async (req, res) => {
    const data = await variantService.getVariantsByProductId(
      req.params.productId,
    );
    res.status(200).json({ success: true, ...data });
  },
);

export const getVariantByIdController = asyncHandler(async (req, res) => {
  const data = await variantService.getVariantById(req.params.id);
  res.status(200).json({ success: true, data });
});

export const updateVariantByIdController = asyncHandler(async (req, res) => {
  const data = await variantService.updateVariantById(
    req.params.id,
    req.body,
    req.files,
  );
  res.status(200).json({ success: true, data });
});

export const updateVariantStockController = asyncHandler(async (req, res) => {
  const data = await variantService.updateVariantStock(req.params.id, req.body);
  res.status(200).json({ success: true, data });
});

export const deleteVariantByIdController = asyncHandler(async (req, res) => {
  const data = await variantService.deleteVariantById(req.params.id);
  res.status(200).json({ success: true, data });
});
