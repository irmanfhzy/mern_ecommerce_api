import ProtectedAdminRoute from "./ProtectedAdminRoute";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";

const adminRoute = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        element: <ProtectedAdminRoute />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "products",
            element: <Products />,
          },
        ],
      },
    ],
  },
];

export default adminRoute;
