import UserLayout from "../layouts/UserLayout";
import Home from "../pages/user/Home";
import ShoppingCart from "../pages/user/ShoppingCart";

const userRoute = [
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "cart",
        element: <ShoppingCart />,
      },
    ],
  },
];

export default userRoute;
