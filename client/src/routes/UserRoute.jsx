import ProtectedUserRoute from "./ProtectedUserRoute";
import UserLayout from "../layouts/UserLayout";

import Home from "../pages/user/Home";
import About from "../pages/user/About";
import Cart from "../pages/user/Cart";
import ProductDetail from "../pages/user/ProductDetail";
import Checkout from "../pages/user/Checkout";
import AddAddress from "../pages/user/AddAddress";
import Profile from "../pages/user/Profile";
import OrderDetail from "../pages/user/OrderDetail";
import MyOrders from "../pages/user/MyOrders";
import EditProfile from "../pages/user/EditProfile";
import Addresses from "../pages/user/Addresses";
import EditAddress from "../pages/user/EditAddress";
import Account from "../pages/user/Account";
import EditEmail from "../pages/user/EditEmail";
import EditUsername from "../pages/user/EditUsername";
import EditPhone from "../pages/user/EditPhone";
import ChangePassword from "../pages/user/ChangePassword";
import ChangeProfilePicture from "../pages/user/ChangeProfilePicture";

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
        path: "about",
        element: <About />,
      },
      {
        path: "product/:productId/:slug",
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
            path: "profile/picture/change",
            element: <ChangeProfilePicture />,
          },
          {
            path: "profile/edit",
            element: <EditProfile />,
          },
          {
            path: "profile/account",
            element: <Account />,
          },
          {
            path: "profile/account/email/edit",
            element: <EditEmail />,
          },
          {
            path: "profile/account/username/edit",
            element: <EditUsername />,
          },
          {
            path: "profile/account/phone/edit",
            element: <EditPhone />,
          },
          {
            path: "profile/account/password/change",
            element: <ChangePassword />,
          },
          {
            path: "profile/addresses",
            element: <Addresses />,
          },
          {
            path: "profile/addresses/new",
            element: <AddAddress />,
          },
          {
            path: "profile/addresses/:addressId/edit",
            element: <EditAddress />,
          },
          {
            path: "my-orders",
            element: <MyOrders />,
          },
          {
            path: "my-orders/:orderId",
            element: <OrderDetail />,
          },
        ],
      },
    ],
  },
];

export default userRoute;
