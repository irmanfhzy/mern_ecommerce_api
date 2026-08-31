import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";

import userRoute from "./UserRoute";
import adminRoute from "./AdminRoute";
import authRoute from "./AuthRoute";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [...userRoute, ...adminRoute, ...authRoute],
  },
]);

export default router;
