const PATHS = {
  PUBLIC: {
    HOME: "/",
    ABOUT: "/about",
    LOGIN: "/login",
    REGISTER: "/register",
    PRODUCT_DETAIL: "/product/:productId/:slug",
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

    PRODUCTS_READ: (productId) => `/admin/products/${productId}`,

    PRODUCTS_CREATE: "/admin/products/create",

    PRODUCTS_EDIT: (productId) => `/admin/products/${productId}/edit`,

    PRODUCTS_VARIANTS_CREATE: (productId) =>
      `/admin/products/${productId}/variants/create`,

    PRODUCTS_VARIANTS_EDIT: (productId, variantId) =>
      `/admin/products/${productId}/variants/${variantId}/edit`,

    PRODUCTS_VARIANTS_RESTOCK: (productId, variantId) =>
      `/admin/products/${productId}/variants/${variantId}/restock`,

    ORDERS: "/admin/orders",

    ORDERS_READ: (orderId) => `/admin/orders/${orderId}`,

    USERS: "/admin/users",
    SETTINGS: "/admin/settings",
  },
};

export default PATHS;
