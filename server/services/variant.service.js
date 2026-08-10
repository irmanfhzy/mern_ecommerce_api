import mongoose from "mongoose";

import cloudinary from "../config/cloudinary.js";

import Product from "../models/product.model.js";
import Variant from "../models/variant.model.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";

import IMAGE_CONFIG from "../constants/image.constant.js";
import {
  INVENTORY_REASON,
  INVENTORY_TYPE,
} from "@ecommerce/shared/constants/index.js";

import AppError from "../utils/AppError.js";
import * as checker from "../utils/errorChecker.js";
import processImage from "../utils/processingImage.js";
import uploadImage from "../utils/uploadingImage.js";

import { createInventoryHistory } from "./inventoryHistory.service.js";

export const createVariants = async ({
  productId,
  variants,
  variantFiles = {},
  uploadedImages = [],
  session,
}) => {
  if (!Array.isArray(variants) || variants.length === 0) {
    throw new AppError("At least one variant is required", 400);
  }

  const documents = [];

  for (let index = 0; index < variants.length; index++) {
    const { attributes, sku, stock, costPrice, sellingPrice } = variants[index];

    const parsedStock = Number(stock);
    const parsedCostPrice = Number(costPrice);
    const parsedSellingPrice = Number(sellingPrice);

    if (!Array.isArray(attributes) || attributes.length === 0) {
      throw new AppError("Attributes are required", 400);
    }

    for (const attribute of attributes) {
      if (!attribute.key || !attribute.value) {
        throw new AppError("Each attribute must have key and value", 400);
      }
    }

    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      throw new AppError("Invalid stock value", 400);
    }

    if (Number.isNaN(parsedCostPrice) || parsedCostPrice < 0) {
      throw new AppError("Invalid price value", 400);
    }

    if (Number.isNaN(parsedSellingPrice) || parsedSellingPrice < 0) {
      throw new AppError("Invalid price value", 400);
    }

    const variantId = new mongoose.Types.ObjectId();

    const files = variantFiles[index] || [];

    const images = [];

    for (const file of files) {
      const processedImage = await processImage(
        file.buffer,
        IMAGE_CONFIG.VARIANT,
      );

      const uploaded = await uploadImage(
        processedImage,
        `variants/${variantId}`,
      );

      uploadedImages.push(uploaded);

      images.push({
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      });
    }

    documents.push({
      _id: variantId,
      productId,
      attributes,
      sku,
      stock: parsedStock,
      costPrice: parsedCostPrice,
      sellingPrice: parsedSellingPrice,
      images,
    });
  }

  const createdVariants = await Variant.create(documents, {
    session,
  });

  for (const variant of createdVariants) {
    await createInventoryHistory({
      variantId: variant._id,
      type: INVENTORY_TYPE.IN,
      quantity: variant.stock,
      reason: INVENTORY_REASON.INITIAL,
      referenceId: variant._id,
      session,
    });
  }

  return createdVariants;
};

export const addVariant = async (productId, body, files = []) => {
  const product = await Product.findById(productId);

  checker.checkDocument(product, "Product not found", 404);

  const variants = [body];

  const variantFiles = {
    0: files,
  };

  const session = await mongoose.startSession();

  const uploadedImages = [];

  try {
    session.startTransaction();

    const createdVariants = await createVariants({
      productId,
      variants,
      variantFiles,
      uploadedImages,
      session,
    });

    await session.commitTransaction();

    return createdVariants[0];
  } catch (error) {
    await session.abortTransaction();

    if (uploadedImages.length) {
      await Promise.allSettled(
        uploadedImages.map((image) =>
          cloudinary.uploader.destroy(image.public_id),
        ),
      );
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

export const getVariantsByProductId = async (productId, query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 10, 50);
  const skip = (page - 1) * limit;

  const sort = {
    createdAt: query.sort === "oldest" ? 1 : -1,
  };

  const [variants, total] = await Promise.all([
    Variant.find({ productId }).sort(sort).skip(skip).limit(limit).lean(),

    Variant.countDocuments({ productId }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    items: variants,
  };
};

export const getVariantById = async (id) => {
  const variant = await Variant.findById(id).lean();

  checker.checkDocument(variant, "Variant not found", 404);

  return variant;
};

export const updateVariantById = async (id, body, files = {}) => {
  const { attributes, sku, costPrice, sellingPrice } = body;

  const variant = await Variant.findById(id);

  checker.checkDocument(variant, "Variant not found", 404);

  const updatedData = {};

  if (attributes !== undefined) {
    if (!Array.isArray(attributes) || attributes.length === 0) {
      throw new AppError("Attributes are required", 400);
    }

    for (const attribute of attributes) {
      if (!attribute.key || !attribute.value) {
        throw new AppError("Each attribute must have key and value", 400);
      }
    }

    updatedData.attributes = attributes;
  }

  if (sku !== undefined) {
    updatedData.sku = sku;
  }

  if (costPrice !== undefined) {
    const parsedCostPrice = Number(costPrice);

    if (Number.isNaN(parsedCostPrice) || parsedCostPrice < 0) {
      throw new AppError("Invalid price value", 400);
    }

    updatedData.costPrice = parsedCostPrice;
  }

  if (sellingPrice !== undefined) {
    const parsedSellingPrice = Number(sellingPrice);

    if (Number.isNaN(parsedSellingPrice) || parsedSellingPrice < 0) {
      throw new AppError("Invalid price value", 400);
    }

    updatedData.sellingPrice = parsedSellingPrice;
  }

  let uploadedImages = [];

  try {
    if (files?.length) {
      uploadedImages = await Promise.all(
        files.map(async (file) => {
          const processedImage = await processImage(
            file.buffer,
            IMAGE_CONFIG.VARIANT,
          );
          const uploadedImage = await uploadImage(
            processedImage,
            `variants/${variant._id}`,
          );

          return uploadedImage;
        }),
      );

      updatedData.images = uploadedImages.map((img) => ({
        url: img.secure_url,
        publicId: img.public_id,
      }));
    }

    const updatedVariant = await Variant.findByIdAndUpdate(id, updatedData, {
      runValidators: true,
      returnDocument: "after",
    });

    if (files?.length && variant.images?.length) {
      await Promise.allSettled(
        variant.images.map((img) => cloudinary.uploader.destroy(img.publicId)),
      );
    }

    return updatedVariant.toObject();
  } catch (error) {
    if (uploadedImages.length) {
      await Promise.allSettled(
        uploadedImages.map((img) => cloudinary.uploader.destroy(img.public_id)),
      );
    }

    throw error;
  }
};

export const updateVariantStock = async (id, body) => {
  const { quantity, type, reason } = body;

  const parsedQuantity = Number(quantity);

  if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
    throw new AppError("Invalid quantity", 400);
  }

  if (type !== INVENTORY_TYPE.IN && type !== INVENTORY_TYPE.OUT) {
    throw new AppError("Invalid inventory type", 400);
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const variant = await Variant.findById(id).session(session);

    checker.checkDocument(variant, "Variant not found", 404);

    if (type === INVENTORY_TYPE.OUT && variant.stock < parsedQuantity) {
      throw new AppError("Insufficient stock", 400);
    }

    variant.stock =
      type === INVENTORY_TYPE.IN
        ? variant.stock + parsedQuantity
        : variant.stock - parsedQuantity;

    await variant.save({ session });

    await createInventoryHistory({
      variantId: variant._id,
      type,
      quantity: parsedQuantity,
      reason,
      referenceId: variant._id,
      session,
    });

    await session.commitTransaction();

    return variant.toObject();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const deleteVariantById = async (id) => {
  const deletedVariant = await Variant.findByIdAndDelete(id);

  checker.checkDocument(deletedVariant, "Variant not found", 404);

  if (deletedVariant.images?.length) {
    await Promise.allSettled(
      deletedVariant.images.map(async (img) => {
        const used = await Order.exists({
          "items.variantImages.publicId": img.publicId,
        });

        if (!used) {
          await cloudinary.uploader.destroy(img.publicId);
        }
      }),
    );
  }

  await Cart.updateMany(
    {},
    {
      $pull: {
        items: {
          variantId: deletedVariant._id,
        },
      },
    },
  );

  return deletedVariant;
};
