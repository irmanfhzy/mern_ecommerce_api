import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ROLE } from "@ecommerce/shared/constants/index.js";

export default function AdminRoute() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== ROLE.ADMIN) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
