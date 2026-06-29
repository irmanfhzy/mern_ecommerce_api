import mongoose from "mongoose";

import cloudinary from "../config/cloudinary.js";

import Product from "../models/product.model.js";
import Variant from "../models/variant.model.js";

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

export const addVariant = async (productId, body, files) => {
  const { attributes, sku, stock, price } = body;

  const parsedStock = Number(stock);
  const parsedPrice = Number(price);

  const product = await Product.findById(productId);

  checker.checkDocument(product, "Product not found", 404);

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

  if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
    throw new AppError("Invalid price value", 400);
  }

  const session = await mongoose.startSession();

  let uploadedImages = [];

  try {
    session.startTransaction();

    const variantId = new mongoose.Types.ObjectId();

    if (files?.length) {
      uploadedImages = await Promise.all(
        files.map(async (file) => {
          const processedImage = await processImage(
            file.buffer,
            IMAGE_CONFIG.VARIANT,
          );

          const uploadedImage = await uploadImage(
            processedImage,
            `variants/${variantId}`,
          );

          return uploadedImage;
        }),
      );
    }
    const [variant] = await Variant.create(
      [
        {
          _id: variantId,
          productId,
          attributes,
          sku,
          stock: parsedStock,
          price: parsedPrice,
          images: uploadedImages.map((img) => ({
            url: img.secure_url,
            publicId: img.public_id,
          })),
        },
      ],
      { session },
    );

    await createInventoryHistory({
      variantId: variant._id,
      type: INVENTORY_TYPE.IN,
      quantity: parsedStock,
      reason: INVENTORY_REASON.INITIAL,
      referenceId: variant._id,
      session,
    });

    await session.commitTransaction();

    return variant;
  } catch (error) {
    await session.abortTransaction();

    if (uploadedImages.length) {
      await Promise.allSettled(
        uploadedImages.map((img) => cloudinary.uploader.destroy(img.public_id)),
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

export const updateVariantById = async (id, body, files) => {
  const { attributes, sku, price } = body;

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

  if (price !== undefined) {
    const parsedPrice = Number(price);

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      throw new AppError("Invalid price value", 400);
    }

    updatedData.price = parsedPrice;
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
      deletedVariant.images.map((img) =>
        cloudinary.uploader.destroy(img.publicId),
      ),
    );
  }

  return deletedVariant;
};
