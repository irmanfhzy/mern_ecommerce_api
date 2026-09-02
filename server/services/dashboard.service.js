import Product from "../models/product.model.js";
import Variant from "../models/variant.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import InventoryHistory from "../models/inventoryHistory.model.js";

import * as productService from "./product.service.js";
import * as orderService from "./order.service.js";
import * as userService from "./user.service.js";

import { ORDER_STATUS } from "@ecommerce/shared/constants/index.js";

const LOW_STOCK_THRESHOLD = 5;

export const getDashboard = async () => {
  const [products, orders, users, recentOrders, lowStock, inventoryActivity, orderStatus] =
    await Promise.all([
      productService.getProductStatistics(),
      orderService.getOrderStatistics(),
      userService.getUserStatistics(),

      Order.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),

      Variant.find({ stock: { $lte: LOW_STOCK_THRESHOLD } })
        .populate("productId", "name")
        .sort({ stock: 1, updatedAt: -1 })
        .limit(8)
        .lean(),

      InventoryHistory.find()
        .populate({
          path: "variantId",
          select: "sku attributes productId",
          populate: { path: "productId", select: "name" },
        })
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),

      Order.aggregate([
        {
          $group: {
            _id: "$orderStatus",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

  const status = Object.values(ORDER_STATUS).reduce((result, value) => {
    result[value] = 0;
    return result;
  }, {});

  for (const item of orderStatus) {
    status[item._id] = item.count;
  }

  return {
    products,
    orders: {
      ...orders,
      recent: recentOrders,
      status,
    },
    users,
    inventory: {
      lowStock,
      activity: inventoryActivity,
      lowStockThreshold: LOW_STOCK_THRESHOLD,
    },
  };
};
