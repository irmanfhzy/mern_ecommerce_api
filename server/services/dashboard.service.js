import * as productService from "./product.service.js";
import * as orderService from "./order.service.js";
import * as userService from "./user.service.js";

export const getDashboard = async () => {
  const [products, orders, users] = await Promise.all([
    productService.getProductStatistics(),
    orderService.getOrderStatistics(),
    userService.getUserStatistics(),
  ]);

  return {
    products,
    orders,
    users,
  };
};
