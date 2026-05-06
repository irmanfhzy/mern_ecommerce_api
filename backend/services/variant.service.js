import Variant from "../models/product.model";
import Variant from "../models/variant.model";
import { AppError } from "../utils/AppError";

export const addVariant = async (id, body) => {
  const productId = id;
  const { attributes, sku, stock, price } = body;
  const product = await Variant.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }
  if (!attributes || !Array.isArray(attributes) || attributes.length === 0) {
    throw new AppError(
      "Attributes are required and must be a non-empty array",
      400,
    );
  }

  for (const attribute of attributes) {
    if (!attribute.key || !attribute.value) {
      throw new AppError("Each attribute must have key and value", 400);
    }
  }

  if (typeof stock !== "number" || stock < 0) {
    throw new AppError("Invalid stock value", 400);
  }

  if (typeof price !== "number" || price < 0) {
    throw new AppError("Invalid price value", 400);
  }

  return await Variant.create({
    productId,
    attributes,
    sku,
    stock,
    price,
  });
};

export const getVariantsByProductId = async (productId, query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 10, 50);
  const skip = (page - 1) * limit;

  const filter = { productId };

  const sort = {};
  if (query.sort === "newest") sort.createdAt = -1;
  else if (query.sort === "oldest") sort.createdAt = 1;
  else sort.createdAt = -1;

  const variants = await Variant.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Variant.countDocuments(filter);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: variants,
  };
};

export const getVariantById = async (id) => {
  const variant = await Variant.findById(id).lean();

  if (!variant) {
    throw new AppError("Variant is not found", 404);
  }
  return variant;
};

export const updateVariantById = async (id, body) => {
  const { sku, stock, price } = body;
  if (stock === undefined || typeof stock !== "number" || stock < 0) {
    throw new AppError("Invalid stock value", 400);
  }

  if (price === undefined || typeof price !== "number" || price < 0) {
    throw new AppError("Invalid price value", 400);
  }

  const updatedData = {};
  if (typeof stock === "number" && stock >= 0) updatedData.stock = stock;
  if (typeof price === "number" && price >= 0) updatedData.price = price;
  if (typeof sku === "string") updatedData.sku = sku;

  const updatedVariant = await Variant.findByIdAndUpdate(id, updatedData, {
    runValidators: true,
    returnDocument: "after",
  });

  if (!updatedVariant) {
    throw new AppError("Variant not found", 404);
  }

  return updatedVariant;
};

export const deleteVariantById = async (id) => {
  const deletedVariant = await Variant.findByIdAndDelete(id);

  if (!deletedVariant) {
    throw new AppError("Variant not found", 404);
  }

  return deletedVariant;
};
