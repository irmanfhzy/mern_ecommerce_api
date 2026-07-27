import ProtectedAdminRoute from "./ProtectedAdminRoute";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import ProductsList from "../pages/admin/ProductsList";
import AddProduct from "../pages/admin/AddProduct";

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
        ],
      },
    ],
  },
];

export default adminRoute;
