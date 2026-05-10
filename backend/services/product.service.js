import Product from "../models/product.model.js";
import Variant from "../models/variant.model.js";
import * as checker from "../utils/errorChecker.js";
import { AppError } from "../utils/AppError.js";

const attachPriceRange = (products, variants) => {
  const variantMap = variants.reduce((acc, variant) => {
    const id = variant.productId.toString();
    if (!acc[id]) acc[id] = [];
    acc[id].push(variant);
    return acc;
  }, {});

  return products.map((product) => {
    const productVariants = variantMap[product._id.toString()] || [];

    let priceRange = null;

    if (productVariants.length) {
      let min = Infinity;
      let max = -Infinity;

      for (const variant of productVariants) {
        if (variant.price < min) min = variant.price;
        if (variant.price > max) max = variant.price;
      }
      priceRange = {
        min,
        max,
      };
    }

    return {
      ...product,
      priceRange,
    };
  });
};

export const addProduct = async (body) => {
  const { name, brand, description, image } = body;
  checker.checkInputs({ name });
  return await Product.create({ name, brand, description, image });
};

export const getAdminProducts = async (query = {}) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(query.limit, 10) || 10, 50);
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.brand) filter.brand = query.brand;

  const sort = {};
  if (query.sort === "newest") sort.createdAt = -1;
  else if (query.sort === "oldest") sort.createdAt = 1;
  else sort.createdAt = -1;

  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const productIds = products.map((product) => product._id);

  const variants = await Variant.find({
    productId: { $in: productIds },
  }).lean();

  const data = attachPriceRange(products, variants);

  const total = await Product.countDocuments(filter);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data,
  };
};

export const getPublicProducts = async (query = {}) => {
  const limit = Math.min(parseInt(query.limit, 10) || 10, 50);
  const lastId = query.lastId;

  const filter = {};
  if (query.brand) filter.brand = query.brand;

  checker.checkObjectId(lastId, "Invalid cursor");
  filter._id = { $lt: lastId };

  const products = await Product.find(filter)
    .sort({ _id: -1 })
    .limit(limit)
    .lean();

  const productIds = products.map((product) => product._id);

  const variants = await Variant.find({
    productId: { $in: productIds },
  }).lean();

  const data = attachPriceRange(products, variants);

  const nextCursor =
    products.length === limit ? products[products.length - 1]._id : null;

  return {
    limit,
    nextCursor,
    data,
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).lean();

  checker.checkDoc(product, "Product not found");

  const variants = await Variant.find({ productId: id }).lean();

  return {
    ...product,
    variants,
  };
};

export const searchProduct = async (keyword) => {
  if (!keyword) {
    return getPublicProducts({ limit: 10 });
  }

  const products = await Product.find(
    { $text: { $search: keyword } },
    { score: { $meta: "textScore" } },
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(10)
    .lean();

  const productIds = products.map((product) => product._id);
  const variants = await Variant.find({
    productId: { $in: productIds },
  }).lean();

  const data = attachPriceRange(products, variants);

  return {
    limit: 10,
    data,
  };
};

export const updateProductById = async (id, body) => {
  const { name, brand, description, image } = body;
  const updatedData = {};
  if (name) updatedData.name = name;
  if (brand !== undefined) updatedData.brand = brand;
  if (description !== undefined) updatedData.description = description;
  if (image !== undefined) updatedData.image = image;

  const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
    runValidators: true,
    returnDocument: "after",
  });
  checker.checkDoc(updatedProduct, "Product not found");
  return updatedProduct;
};

export const deleteProductById = async (id) => {
  const deletedProduct = await Product.findByIdAndDelete(id);

  checker.checkDoc(deletedProduct, "Product not found");

  await Variant.deleteMany({ productId: id });

  return deletedProduct;
};
