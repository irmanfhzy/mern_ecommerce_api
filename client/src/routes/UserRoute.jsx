import ProtectedUserRoute from "./ProtectedUserRoute";
import UserLayout from "../layouts/UserLayout";

import Home from "../pages/user/Home";
import Cart from "../pages/user/Cart";
import ProductDetail from "../pages/user/ProductDetail";
import Checkout from "../pages/user/Checkout";
import AddAddress from "../pages/user/AddAddress";
import Profile from "../pages/user/Profile";

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
        path: "product/:id/:slug",
        element: <ProductDetail />,
      },

      {
        element: <ProtectedUserRoute />,
        children: [
          {
            path: "cart",
            element: <Cart />,
          },
          {
            path: "checkout",
            element: <Checkout />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "addresses/new",
            element: <AddAddress />,
          },
        ],
      },
    ],
  },
];

export default userRoute;
