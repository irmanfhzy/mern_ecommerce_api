import AdminLayout from "../layouts/AdminLayout";
import Products from "../pages/admin/Products";
import Dashboard from "../pages/admin/Dashboard";

const adminRoute = [
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
        element: <Products />,
      },
    ],
  },
];

export default adminRoute;
