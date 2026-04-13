import { createBrowserRouter } from "react-router-dom";
import userRoute from "./UserRoute";
import adminRoute from "./AdminRoute";
import authRoute from "./AuthRoute";

const router = createBrowserRouter([...userRoute, ...adminRoute, ...authRoute]);

export default router;
