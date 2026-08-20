import AuthLayout from "../layouts/AuthLayout";
import AuthRoute from "./ProtectedAuthRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

const authRoute = [
  {
    element: <AuthRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
        ],
      },
    ],
  },
];

export default authRoute;
