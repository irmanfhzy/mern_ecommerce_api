import ProtectedAdminRoute from "./ProtectedAdminRoute";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import ProductsList from "../pages/admin/ProductsList";
import AddProduct from "../pages/admin/AddProduct";
import ProductDetail from "../pages/admin/ProductDetail";
import EditProductInfo from "../pages/admin/EditProductInfo";
import EditVariant from "../pages/admin/EditVariant";
import RestockVariant from "../pages/admin/RestockVariant";
import OrdersList from "../pages/admin/OrdersList";
import AdminOrderDetail from "../pages/admin/AdminOrderDetail";
import AppSetting from "../pages/admin/AppSetting";

const adminRoute = [
  {
    element: <ProtectedAdminRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "products",
            element: <ProductsList />,
          },
          {
            path: "products/create",
            element: <AddProduct />,
          },
          {
            path: "products/:productId",
            element: <ProductDetail />,
          },
          {
            path: "products/:productId/edit",
            element: <EditProductInfo />,
          },
          {
            path: "products/:productId/variants/:variantId/edit",
            element: <EditVariant />,
          },
          {
            path: "products/:productId/variants/:variantId/restock",
            element: <RestockVariant />,
          },
          {
            path: "orders",
            element: <OrdersList />,
          },
          {
            path: "orders",
            element: <OrdersList />,
          },
          {
            path: "orders/:orderId",
            element: <AdminOrderDetail />,
          },
          {
            path: "settings",
            element: <AppSetting />,
          },
        ],
      },
    ],
  },
];

export default adminRoute;
