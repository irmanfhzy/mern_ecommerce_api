const PATHS = {
  PUBLIC: {
    HOME: "/",
    ABOUT: "/about",
    LOGIN: "/login",
    REGISTER: "/register",
  },

  USER: {
    PROFILE: "/profile",
    CART: "/cart",
    CHECKOUT: "/checkout",
    MY_ORDERS: "/my-orders",
  },

  ADMIN: {
    DASHBOARD: "/admin",
    PRODUCTS: "/admin/products",
    PRODUCTS_READ: "/admin/products/:productId",
    PRODUCTS_CREATE: "/admin/products/create",
    PRODUCTS_EDIT: "/admin/products/:productId/edit",
    ORDERS: "/admin/orders",
    USERS: "/admin/users",
    SETTINGS: "/admin/settings",
  },
};

export default PATHS;
