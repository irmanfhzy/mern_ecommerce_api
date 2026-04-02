import { createBrowserRouter } from "react-router-dom";
import userRoute from "./UserRoute";
import adminRoute from "./AdminRoute";

const router = createBrowserRouter([...userRoute, ...adminRoute]);

export default router;
