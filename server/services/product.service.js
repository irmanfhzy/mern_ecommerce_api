import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

import Product from "../models/product.model.js";
import Variant from "../models/variant.model.js";

import * as checker from "../utils/errorChecker.js";

import AppError from "../utils/AppError.js";
import generateSlug from "../utils/slugGenerator.js";
import IMAGE_CONFIG from "../constants/image.constant.js";
import processImage from "../utils/processingImage.js";
import uploadImage from "../utils/uploadingImage.js";
import getPriceRange from "../utils/getPriceRange.js";

const attachPriceRange = (products = [], variants = []) => {
  const variantMap = variants.reduce((acc, variant) => {
    const id = variant.productId.toString();

    if (!acc[id]) {
      acc[id] = [];
    }

    acc[id].push(variant);

    return acc;
  }, {});

  return products.map((product) => {
    const productVariants = variantMap[product._id.toString()] || [];

    const priceRange = getPriceRange(productVariants);

    return {
      ...product,
      priceRange,
    };
  });
};

export const addProduct = async (body, files = []) => {
  const { name, brand, description } = body;

  const productId = new mongoose.Types.ObjectId();
  const slug = generateSlug(name);

  const uploadedImages = [];

  try {
    if (files.length) {
      for (const file of files) {
        const processedImage = await processImage(
          file.buffer,
          IMAGE_CONFIG.PRODUCT,
        );

        const uploaded = await uploadImage(
          processedImage,
          `products/${productId}`,
        );

        uploadedImages.push({
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
        });
      }
    }

    const product = await Product.create({
      _id: productId,
      name,
      slug,
      brand,
      description,
      images: uploadedImages,
    });

    return product;
  } catch (error) {
    if (uploadedImages.length) {
      await Promise.allSettled(
        uploadedImages.map((image) =>
          cloudinary.uploader.destroy(image.publicId),
        ),
      );
    }

    throw error;
  }
};

export const getAdminProducts = async (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 10, 50);

  const skip = (page - 1) * limit;

  const filter = {};

  if (query.brand) {
    filter.brand = query.brand;
  }

  const sort = {};

  if (query.sort === "oldest") {
    sort.createdAt = 1;
  } else {
    sort.createdAt = -1;
  }

  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const productIds = products.map((product) => product._id);

  const variants = await Variant.find({
    productId: { $in: productIds },
  }).lean();

  const items = attachPriceRange(products, variants);

  const total = await Product.countDocuments(filter);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getPublicProducts = async (query = {}) => {
  const limit = Math.min(parseInt(query.limit, 10) || 10, 50);

  const filter = {};

  if (query.brand) {
    filter.brand = query.brand;
  }

  if (query.lastId) {
    if (!mongoose.Types.ObjectId.isValid(query.lastId)) {
      throw new AppError("Invalid lastId", 400);
    }

    filter._id = {
      $lt: query.lastId,
    };
  }

  const products = await Product.find(filter)
    .sort({ _id: -1 })
    .limit(limit)
    .lean();

  const productIds = products.map((product) => product._id);

  const variants = await Variant.find({
    productId: { $in: productIds },
  }).lean();

  const items = attachPriceRange(products, variants);

  const nextCursor =
    products.length === limit ? products[products.length - 1]._id : null;

  return {
    items,
    pagination: {
      limit,
      nextCursor,
    },
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).lean();

  checker.checkDocument(product, "Product not found");

  const variants = await Variant.find({
    productId: id,
  }).lean();

  const priceRange = getPriceRange(variants);

  return {
    items: {
      ...product,
      variants,
      priceRange,
    },
  };
};

export const searchProduct = async (keyword) => {
  if (!keyword) {
    return getPublicProducts({ limit: 10 });
  }

  const products = await Product.find({
    name: {
      $regex: keyword,
      $options: "i",
    },
  })
    .limit(10)
    .lean();

  const productIds = products.map((product) => product._id);

  const variants = await Variant.find({
    productId: {
      $in: productIds,
    },
  }).lean();

  const items = attachPriceRange(products, variants);

  return {
    items,
    pagination: {
      limit: 10,
    },
  };
};

export const updateProductById = async (id, body, files = []) => {
  const { name, brand, description, isActive, deletedImages } = body;

  const product = await Product.findById(id);

  checker.checkDocument(product, "Product not found");

  if (name !== undefined) {
    product.name = name;
    product.slug = generateSlug(name);
  }

  if (brand !== undefined) {
    product.brand = brand;
  }

  if (description !== undefined) {
    product.description = description;
  }

  if (isActive !== undefined) {
    product.isActive = isActive;
  }

  let imagesToDelete = [];

  if (deletedImages) {
    try {
      imagesToDelete = JSON.parse(deletedImages);

      if (!Array.isArray(imagesToDelete)) {
        throw new Error();
      }
    } catch {
      throw new AppError("Invalid deletedImages format", 400);
    }
  }

  const validPublicIds = product.images
    .filter((image) => imagesToDelete.includes(image.publicId))
    .map((image) => image.publicId);

  const uploadedImages = [];

  try {
    if (validPublicIds.length) {
      product.images = product.images.filter(
        (image) => !validPublicIds.includes(image.publicId),
      );

      await Promise.allSettled(
        validPublicIds.map((publicId) => cloudinary.uploader.destroy(publicId)),
      );
    }

    if (files.length) {
      for (const file of files) {
        const processedImage = await processImage(
          file.buffer,
          IMAGE_CONFIG.PRODUCT,
        );

        const uploaded = await uploadImage(processedImage, `products/${id}`);

        uploadedImages.push({
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
        });
      }

      product.images.push(...uploadedImages);
    }

    await product.save();

    return product;
  } catch (error) {
    if (uploadedImages.length) {
      await Promise.allSettled(
        uploadedImages.map((image) =>
          cloudinary.uploader.destroy(image.publicId),
        ),
      );
    }

    throw error;
  }
};

export const deleteProductById = async (id) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedProduct = await Product.findByIdAndDelete(id)
      .session(session)
      .lean();

    checker.checkDocument(deletedProduct, "Product not found");

    const oldImagePublicId = deletedProduct?.image?.publicId;

    const productVariants = await Variant.find({
      productId: id,
    })
      .select("images.publicId")
      .session(session)
      .lean();

    await Variant.deleteMany(
      {
        productId: id,
      },
      {
        session,
      },
    );

    await session.commitTransaction();

    const publicIds = [
      oldImagePublicId,
      ...productVariants.flatMap((variant) =>
        variant.images.map((image) => image.publicId),
      ),
    ].filter(Boolean);

    const uniquePublicIds = [...new Set(publicIds)];

    if (uniquePublicIds.length) {
      await Promise.allSettled(
        uniquePublicIds.map((publicId) =>
          cloudinary.uploader.destroy(publicId),
        ),
      );
    }

    return deletedProduct;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};
